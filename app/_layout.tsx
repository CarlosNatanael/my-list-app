import { ListProvider } from './context/ListContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { StyleSheet, Platform } from 'react-native';

export default function RootLayout() {
  return (
    <ListProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerStyle: { backgroundColor: '#f8f8f8' } }}>
          <Stack.Screen name="index" options={{ title: 'Minha Lista de Compras' }} />
          <Stack.Screen name="cart" options={{ title: 'Meu Carrinho' }} />
          <Stack.Screen name="total" options={{ title: 'Resumo da Compra' }} />
        </Stack>
      </SafeAreaProvider>
    </ListProvider>
  );
}