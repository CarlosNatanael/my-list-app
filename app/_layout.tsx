import { ListProvider } from './_context/ListContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { History } from 'lucide-react-native';

export default function RootLayout() {
  const router = useRouter();

  return (
    <ListProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerStyle: { backgroundColor: '#f8f8f8' } }}>
          <Stack.Screen 
            name="index" 
            options={{ 
              title: 'Minha Lista de Compras',
              headerRight: () => (
                <TouchableOpacity onPress={() => router.push('/history')} style={{ marginRight: 15 }}>
                  <History color="#007AFF" size={26} />
                </TouchableOpacity>
              ),
            }} 
          />
          <Stack.Screen name="cart" options={{ title: 'Meu Carrinho' }} />
          <Stack.Screen name="total" options={{ title: 'Resumo da Compra' }} />
          <Stack.Screen name="history" options={{ title: 'Histórico de Compras' }} />
          <Stack.Screen name="history/[id]" options={{ title: 'Detalhes da Compra' }} />
        </Stack>
      </SafeAreaProvider>
    </ListProvider>
  );
}