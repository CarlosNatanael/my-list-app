import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ListProvider } from '../context/ListContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack, SplashScreen } from 'expo-router';
import { useEffect } from 'react';

// Impede que a tela de splash suma automaticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ListProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerStyle: { backgroundColor: '#f8f8f8' } }} />
        </SafeAreaProvider>
      </ListProvider>
    </GestureHandlerRootView>
  );
}