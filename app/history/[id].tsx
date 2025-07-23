import React from 'react';
import { SafeAreaView, Text, StyleSheet, View, ScrollView } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Purchase, Item } from '../_context/ListContext';

export default function PurchaseDetailScreen() {
  const { purchase: purchaseString } = useLocalSearchParams<{ purchase: string }>();

  if (!purchaseString) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.storeName}>Compra não encontrada.</Text>
      </SafeAreaView>
    );
  }

  const purchase: Purchase = JSON.parse(purchaseString);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: `Cupom: ${purchase.storeName}` }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.receipt}>
          {/* Cabeçalho do Cupom */}
          <View style={styles.header}>
            <Text style={styles.storeName}>{purchase.storeName}</Text>
            <Text style={styles.date}>Data da Compra: {purchase.date}</Text>
          </View>

          {/* Títulos da Tabela de Itens */}
          <View style={styles.tableHeader}>
            <Text style={[styles.columnHeader, styles.itemColumn]}>Item</Text>
            <Text style={[styles.columnHeader, styles.qtyColumn]}>Qtd</Text>
            <Text style={[styles.columnHeader, styles.totalColumn]}>Subtotal</Text>
          </View>

          {/* Lista de Itens */}
          {purchase.items.map((item: Item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.cellText, styles.itemColumn]}>{item.name}</Text>
              <Text style={[styles.cellText, styles.qtyColumn]}>{item.quantity} {item.unit}</Text>
              <Text style={[styles.cellText, styles.totalColumn]}>
                R$ {((item.price || 0) * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          
          {/* Linha Separadora */}
          <View style={styles.separator} />

          {/* Rodapé com Valor Total */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Valor Total:</Text>
            <Text style={styles.footerTotal}>R$ {(purchase.totalPrice || 0).toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f8', // Um cinza claro para o fundo
    },
    scrollContent: {
        padding: 15,
    },
    receipt: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        alignItems: 'center',
        paddingBottom: 15,
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    storeName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    date: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    tableHeader: {
        flexDirection: 'row',
        paddingBottom: 10,
        marginBottom: 5,
        borderBottomWidth: 2,
        borderBottomColor: '#333',
    },
    columnHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        alignItems: 'center',
    },
    cellText: {
        fontSize: 15,
        color: '#444',
    },
    itemColumn: {
        flex: 3, // Coluna do item com mais espaço
        textAlign: 'left',
    },
    qtyColumn: {
        flex: 1.5,
        textAlign: 'center',
    },
    totalColumn: {
        flex: 1.5,
        textAlign: 'right',
        fontWeight: '500',
    },
    separator: {
        borderTopWidth: 2,
        borderTopColor: '#333',
        marginVertical: 15,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    footerTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#34C759', // Verde para destacar o total
    },
});