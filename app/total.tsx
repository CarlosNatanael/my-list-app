import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet, FlatList, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useList } from './_context/ListContext';
import { useRouter } from 'expo-router';
import { Store, CheckCircle } from 'lucide-react-native';

export default function TotalScreen() {
  const { items, totalPrice, savePurchase } = useList();
  const [storeName, setStoreName] = useState('');
  const router = useRouter();
  const purchaseDate = new Date().toLocaleDateString('pt-BR');

  const handleFinishPurchase = () => {
    if (items.length === 0) {
        Alert.alert("Atenção", "Sua lista está vazia.");
        return;
    }
    Alert.alert(
      "Finalizar Compra",
      "Deseja salvar esta compra no seu histórico e iniciar uma nova lista?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salvar e Finalizar",
          onPress: async () => {
            await savePurchase(storeName);
            router.replace('/');
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDetails}>
        {item.quantity} {item.unit} - R$ {(item.price || 0).toFixed(2)}
      </Text>
      <Text style={styles.itemTotal}>
        Subtotal: R$ {((item.price || 0) * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Resumo da Compra</Text>
          <Text style={styles.dateText}>Data: {purchaseDate}</Text>
        </View>

        <View style={styles.storeContainer}>
          <Store color="#555" size={20} style={styles.storeIcon} />
          <TextInput
            style={styles.storeInput}
            placeholder="Nome da Loja / Atacado"
            value={storeName}
            onChangeText={setStoreName}
            placeholderTextColor="#888"
          />
        </View>

        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum item na sua lista.</Text>}
          scrollEnabled={false}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.totalText}>Valor Total: R$ {totalPrice.toFixed(2)}</Text>
        <TouchableOpacity style={styles.finishButton} onPress={handleFinishPurchase}>
          <CheckCircle color="#fff" size={22} />
          <Text style={styles.finishButtonText}>Finalizar Compra</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// ... (Estilos permanecem os mesmos da resposta anterior)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 150,
  },
  header: {
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  storeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  storeIcon: {
    marginRight: 8,
  },
  storeInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  item: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50', // Cor verde para finalizar
    padding: 16,
    borderRadius: 8,
  },
  finishButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});