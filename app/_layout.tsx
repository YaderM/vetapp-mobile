import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    const token = (global as any).userToken;
    const inTabsGroup = segments[0] === '(tabs)';

    if (!token && inTabsGroup) {
      router.replace('/');
    }
  }, [segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="register" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}