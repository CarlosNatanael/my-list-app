import React from 'react';
import { SafeAreaView, Text, StyleSheet, FlatList, View, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Purchase, Item } from '../_context/ListContext';

export default function PurchaseDetailScreen() {
  const { purchase: purchaseString } = useLocalSearchParams<{ purchase: string }>();
  if (!purchaseString) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.itemName}>Compra não encontrada.</Text>
      </SafeAreaView>
    );
  }

  const purchase: Purchase = JSON.parse(purchaseString);

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetails}>
          {item.quantity} {item.unit} - R$ {(item.price || 0).toFixed(2)}
        </Text>
      </View>
      <Text style={styles.itemTotal}>
        R$ {((item.price || 0) * item.quantity).toFixed(2)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: `Compra em ${purchase.storeName}` }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
            <Text style={styles.storeName}>{purchase.storeName}</Text>
            <Text style={styles.date}>{purchase.date}</Text>
            <Text style={styles.total}>Total: R$ {(purchase.totalPrice || 0).toFixed(2)}</Text>
        </View>
        <FlatList
          data={purchase.items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 15,
    },
    header: {
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },
    storeName: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    date: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 4,
    },
    total: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#34C759',
        textAlign: 'center',
        marginTop: 10,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    itemName: {
        fontSize: 16,
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
    },
});