import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FirebaseAdminService {
  private initialized = false;

  private initIfNeeded() {
    if (this.initialized) return;

    // Avoid double-init (important in watch mode)
    if (admin.apps.length) {
      this.initialized = true;
      return;
    }

    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

    // ✅ Preferred: load from JSON file
    if (serviceAccountPath) {
      const absPath = path.isAbsolute(serviceAccountPath)
        ? serviceAccountPath
        : path.join(process.cwd(), serviceAccountPath);

      if (!fs.existsSync(absPath)) {
        throw new Error(`Firebase service account file not found: ${absPath}`);
      }

      const raw = fs.readFileSync(absPath, 'utf8');
      const json = JSON.parse(raw);

      admin.initializeApp({
        credential: admin.credential.cert(json as any),
      });

      this.initialized = true;
      return;
    }

    // 🔁 Fallback: env vars
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';

    // fix common formatting issues
    privateKey = privateKey
      .replace(/\\n/g, '\n') // convert escaped newlines
      .replace(/^"|"$/g, '') // remove wrapping quotes
      .trim();

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error(
        'Missing Firebase env vars: set FIREBASE_SERVICE_ACCOUNT_PATH (recommended) OR FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY',
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });

    this.initialized = true;
  }

  async verifyIdToken(idToken: string) {
    this.initIfNeeded();
    return admin.auth().verifyIdToken(idToken);
  }
}
