import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* 1. Registramos el index (Login) que acabas de mover a la raíz de app */}
      <Stack.Screen name="index" /> 
      {/* 2. Registramos la carpeta de pestañas */}
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}