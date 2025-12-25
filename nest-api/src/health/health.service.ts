import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  async checkHealth() {
    // בדוגמה: בדיקה פשוטה
    const isHealthy = true; // או בדיקה למסד נתונים וכו'

    if (!isHealthy) {
      // אם יש תקלה - נזרוק שגיאה שה-controller יטפל בה
      throw new Error('System is unhealthy');
    }

    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
    };
  }
}
