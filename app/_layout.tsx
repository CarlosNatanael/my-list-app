import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Tela Inicial' }} />
        <Stack.Screen name="cart" options={{ title: 'Carrinho' }} />
      </Stack>
    </SafeAreaProvider>
  );
}