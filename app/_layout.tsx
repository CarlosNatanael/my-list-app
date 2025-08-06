import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ListProvider } from '../context/ListContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, SplashScreen } from 'expo-router';

// Impede que a tela de splash suma automaticamente antes de tudo estar carregado
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ListProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerStyle: { backgroundColor: '#f8f8f8' } }}>
          </Stack>
        </SafeAreaProvider>
      </ListProvider>
    </GestureHandlerRootView>
  );
}