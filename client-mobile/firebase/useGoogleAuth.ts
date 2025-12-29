import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from './firebase';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_WEB_CLIENT_ID =
  '999606949860-r6nao63m8crlrbfftu3pjks31gd6g658.apps.googleusercontent.com';

export const useGoogleAuth = () => {
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'https',
    path: '@matar_calif/client-mobile',
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    redirectUri, // 🔥 THIS forces auth.expo.io
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
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
