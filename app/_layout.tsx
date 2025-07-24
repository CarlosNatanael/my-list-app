import { ListProvider, useList } from './_context/ListContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { History, Save, ListPlus, Trash2 } from 'lucide-react-native';

const ListScreenHeader = () => {
  const router = useRouter();
  const { clearActiveList } = useList();

  return (
    <View style={{ flexDirection: 'row', gap: 20, marginRight: 15 }}>
      <TouchableOpacity onPress={clearActiveList}>
        <Trash2 color="#d9534f" size={26} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/save-template')}>
        <Save color="#007AFF" size={26} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/templates')}>
        <ListPlus color="#007AFF" size={26} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/history')}>
        <History color="#007AFF" size={26} />
      </TouchableOpacity>
    </View>
  );
};

export default function RootLayout() {
  return (
    <ListProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ headerStyle: { backgroundColor: '#f8f8f8' } }}>
          <Stack.Screen name="index" options={{ title: 'Buy Fast' }} />
          <Stack.Screen 
            name="list" 
            options={{ 
              title: 'Minha Lista de Compras',
              headerRight: () => <ListScreenHeader />, // Usa o novo componente de cabeçalho
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