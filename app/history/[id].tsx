import React, { useMemo } from 'react';
import { SafeAreaView, Text, StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Purchase, Item } from '../_context/ListContext';
import { PieChart } from 'react-native-chart-kit';

// NOVO: Cores predefinidas para cada categoria
const CATEGORY_COLORS: { [key: string]: string } = {
  'Hortifruti': '#4CAF50',       // Verde
  'Padaria': '#FFC107',         // Âmbar
  'Açougue e Frios': '#F44336', // Vermelho
  'Laticínios': '#2196F3',      // Azul
  'Mercearia': '#9C27B0',      // Roxo
  'Bebidas': '#00BCD4',         // Ciano
  'Limpeza': '#03A9F4',         // Azul Claro
  'Higiene': '#E91E63',         // Rosa
  'Remédios': '#F44336',       // Vermelho (para Farmácia)
  'Salgadinhos': '#FF9800',    // Laranja
  'Doces': '#AD52C7',           // Roxo Claro
  'Outros': '#9E9E9E',          // Cinza
};

const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

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

  // Processa os dados para o gráfico

  const dataForChart = useMemo(() => {
    if (!purchase || !purchase.items) return [];

    const spendingByCategory = purchase.items.reduce((acc, item) => {
      const price = (item.price || 0) * item.quantity;
      acc[item.category] = (acc[item.category] || 0) + price;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(spendingByCategory).map(([name, value]) => ({
      name,
      population: value,
      color: CATEGORY_COLORS[name] || '#9E9E9E',
      legendFontColor: '#7F7F7F',
      legendFontSize: 14,
    }));
  }, [purchase]);


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
            <Text style={[styles.columnHeader, styles.unitPriceColumn]}>Valor Uni.</Text>
            <Text style={[styles.columnHeader, styles.totalColumn]}>Subtotal</Text>
          </View>

          {/* Lista de Itens */}
          {purchase.items.map((item: Item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.cellText, styles.itemColumn]}>{item.name}</Text>
              <Text style={[styles.cellText, styles.qtyColumn]}>{item.quantity} {item.unit}</Text>
              <Text style={[styles.cellText, styles.unitPriceColumn]}>R$ {(item.price || 0).toFixed(2)}</Text>
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
          {purchase.paymentMethod && (
            <Text style={styles.paymentMethod}>Pago com: {purchase.paymentMethod}</Text>
          )}
        </View>

        {/* GRÁFICO DE GASTOS */}
        {dataForChart.length > 0 && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Gastos por Categoria</Text>
            <PieChart
              data={dataForChart}
              width={Dimensions.get('window').width - 30}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor={"population"}
              backgroundColor={"transparent"}
              paddingLeft={"15"}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f8',
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
        flex: 3,
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
        color: '#34C759',
    },
    paymentMethod: {
      fontSize: 14,
      fontStyle: 'italic',
      color: '#666',
      textAlign: 'right',
      marginTop: 5,
    },
    chartContainer: {
      marginTop: 20,
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    chartTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 10,
    },
    unitPriceColumn: { flex: 2, textAlign: 'center' },
});