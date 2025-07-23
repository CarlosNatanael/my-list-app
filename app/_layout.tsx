import { ListProvider } from './_context/ListContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { History, Save, ListPlus } from 'lucide-react-native';

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
                <View style={{ flexDirection: 'row', gap: 20, marginRight: 15 }}>
                  <TouchableOpacity onPress={() => router.push('../save-template')}>
                    <Save color="#007AFF" size={26} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('../templates')}>
                    <ListPlus color="#007AFF" size={26} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => router.push('/history')}>
                    <History color="#007AFF" size={26} />
                  </TouchableOpacity>
                </View>
              ),
            }} 
          />
          <Stack.Screen name="cart" options={{ title: 'Meu Carrinho' }} />
          <Stack.Screen name="total" options={{ title: 'Resumo da Compra' }} />
          <Stack.Screen name="history" options={{ title: 'Histórico de Compras' }} />
          <Stack.Screen name="history/[id]" options={{ title: 'Detalhes da Compra' }} />
          <Stack.Screen name="templates" options={{ title: 'Usar Lista Modelo' }} />
          <Stack.Screen name="save-template" options={{ title: 'Salvar Lista', presentation: 'modal' }} />
        </Stack>
      </SafeAreaProvider>
    </ListProvider>
  );
}