import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ListProvider } from './_context/ListContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ListProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerStyle: { backgroundColor: '#f8f8f8' } }}>
            <Stack.Screen name="index" options={{ title: 'Buy Fast' }} />
            <Stack.Screen name="list" options={{ title: 'Minha Lista' }} />
            <Stack.Screen name="cart" options={{ title: 'Meu Carrinho' }} />
            <Stack.Screen name="total" options={{ title: 'Resumo da Compra' }} />
            <Stack.Screen name="history" options={{ title: 'Histórico de Compras' }} />
            <Stack.Screen name="history/[id]" options={{ title: 'Detalhes da Compra' }} />
            <Stack.Screen name="categories" options={{ title: 'Gerenciar Categorias', presentation: 'modal' }} />
            <Stack.Screen name="edit-template" options={{ title: 'Editar Modelo' }} />
            <Stack.Screen name="templates" options={{ title: 'Usar Lista Modelo' }} />
            <Stack.Screen name="save-template" options={{ title: 'Salvar Lista', presentation: 'modal' }} />
          </Stack>
        </SafeAreaProvider>
      </ListProvider>
    </GestureHandlerRootView>
  );
}