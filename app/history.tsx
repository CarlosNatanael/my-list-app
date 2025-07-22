import React from 'react';
import { SafeAreaView, Text, StyleSheet, FlatList, View, TouchableOpacity } from 'react-native';
import { useList } from './_context/ListContext';
import { Link } from 'expo-router';
import { Purchase } from './_context/ListContext';

export default function HistoryScreen() {
  const { purchaseHistory } = useList();
  
  const renderItem = ({ item }: { item: Purchase }) => (
    <Link href={{ pathname: "/history/[id]", params: { id: item.id, purchase: JSON.stringify(item) } }} asChild>
      <TouchableOpacity style={styles.item}>
        <View>
          <Text style={styles.itemName}>{item.storeName}</Text>
          <Text style={styles.itemDetails}>Data: {item.date}</Text>
        </View>
        <Text style={styles.itemTotal}>R$ {item.totalPrice.toFixed(2)}</Text>
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={purchaseHistory}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma compra salva no histórico.</Text>}
        contentContainerStyle={{ padding: 10 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#34C759',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
});