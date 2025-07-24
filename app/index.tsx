import React from 'react';
import { SafeAreaView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ShoppingCart, Pill, Beer } from 'lucide-react-native';
import { useList } from './_context/ListContext';

export default function HomeScreen() {
  const router = useRouter();
  const { setActiveListType } = useList();

  const navigateToList = (listType: 'mercado' | 'farmacia' | 'conveniencia') => {
    setActiveListType(listType);
    router.push('../list');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Minhas Listas</Text>
      <Text style={styles.subtitle}>Selecione uma lista para começar</Text>
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigateToList('mercado')}>
          <ShoppingCart size={40} color="#fff" />
          <Text style={styles.menuButtonText}>Mercado</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigateToList('farmacia')}>
          <Pill size={40} color="#fff" />
          <Text style={styles.menuButtonText}>Farmácia</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => navigateToList('conveniencia')}>
          <Beer size={40} color="#fff" />
          <Text style={styles.menuButtonText}>Conveniência</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40,
  },
  menuContainer: {
    gap: 20,
  },
  menuButton: {
    backgroundColor: '#007AFF',
    padding: 25,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 20,
  },
});