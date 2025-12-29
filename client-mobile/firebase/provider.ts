import { useEffect } from 'react';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebase';
import { GOOGLE_WEB_CLIENT_ID } from './firebase';

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID, // ✅ your real client ID
    redirectUri: makeRedirectUri(), // ✅ proxy handled automatically
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken; // ✅ correct field

      if (!idToken) return;

      const credential = GoogleAuthProvider.credential(idToken);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  return {
    promptGoogleLogin: () => promptAsync(),
    request,
  };
};
