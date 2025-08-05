import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ListProvider } from './context/ListContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

// Impede que a tela de splash suma automaticamente antes de tudo estar carregado
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Carrega as fontes do seu aplicativo
  const [fontsLoaded, fontError] = useFonts({
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Esconde a tela de splash assim que as fontes forem carregadas ou se der erro
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Se as fontes não carregaram ainda (ou deu erro), não renderiza nada para evitar o crash
  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Se chegou aqui, as fontes estão prontas e o app pode ser renderizado com segurança
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