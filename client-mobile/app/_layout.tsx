import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebase';
import { useStore } from '../store/useStore';

export default function RootLayout() {
  const login = useStore((state) => state.login);
  const logout = useStore((state) => state.logout);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        login();   // ✅ user exists → logged in
      } else {
        logout();  // ❌ no user → logged out
      }
    });

    return unsubscribe;
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="product/[id]" />
    </Stack>
  );
}
