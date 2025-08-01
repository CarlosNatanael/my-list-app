import { ListProvider, useList } from './_context/ListContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
// Importe o 'Share' do react-native e um novo ícone
import { TouchableOpacity, View, Share, Alert } from 'react-native';
import { History, Save, ListPlus, Trash2, Share2 } from 'lucide-react-native';

// O cabeçalho agora terá a lógica de compartilhamento
const ListScreenHeader = () => {
  const router = useRouter();
  // Pegamos a lista de itens agrupados por categoria
  const { clearActiveList, uncheckedItemsByCategory } = useList();

  const onShare = async () => {
    try {
      if (uncheckedItemsByCategory.length === 0) {
        Alert.alert("Lista Vazia", "Não há itens para compartilhar.");
        return;
      }

      // 1. Montamos a mensagem de texto
      let message = "Minha Lista de Compras (via Buy Fast):\n\n";
      uncheckedItemsByCategory.forEach(section => {
        message += `*${section.title}*\n`;
        section.data.forEach(item => {
          message += `- ${item.name} (${item.quantity} ${item.unit})\n`;
        });
        message += '\n';
      });

      // 2. Chamamos a função de compartilhar
      await Share.share({
        message: message,
      });
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={{ flexDirection: 'row', gap: 20, marginRight: 15, alignItems: 'center' }}>
      {/* Botão de Compartilhar Adicionado */}
      <TouchableOpacity onPress={onShare}>
        <Share2 color="#007AFF" size={24} />
      </TouchableOpacity>
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
              headerRight: () => <ListScreenHeader />,
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