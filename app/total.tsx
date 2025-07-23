import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet, View, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useList, Item } from './_context/ListContext';
import { useRouter } from 'expo-router';
import { Store, CheckCircle } from 'lucide-react-native';

export default function TotalScreen() {
  const { items, totalPrice, savePurchase } = useList();
  const [storeName, setStoreName] = useState('');
  const router = useRouter();
  const purchaseDate = new Date().toLocaleDateString('pt-BR');

  const handleFinishPurchase = () => {
    if (items.length === 0) {
        Alert.alert("Atenção", "Sua lista de compras está vazia.");
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.receipt}>
          {/* Cabeçalho */}
          <View style={styles.header}>
            <Text style={styles.storeName}>Resumo da Compra</Text>
            <Text style={styles.date}>Data: {purchaseDate}</Text>
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
          
          {/* Títulos da Tabela */}
          <View style={styles.tableHeader}>
            <Text style={[styles.columnHeader, styles.itemColumn]}>Item</Text>
            <Text style={[styles.columnHeader, styles.qtyColumn]}>Qtd</Text>
            <Text style={[styles.columnHeader, styles.totalColumn]}>Subtotal</Text>
          </View>

          {/* Lista de Itens */}
          {items.map((item: Item) => (
            <View key={item.id} style={styles.tableRow}>
              <Text style={[styles.cellText, styles.itemColumn]}>{item.name}</Text>
              <Text style={[styles.cellText, styles.qtyColumn]}>{item.quantity} {item.unit}</Text>
              <Text style={[styles.cellText, styles.totalColumn]}>
                R$ {((item.price || 0) * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
          
          <View style={styles.separator} />

          {/* Rodapé com Valor Total */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Valor Total:</Text>
            <Text style={styles.footerTotal}>R$ {totalPrice.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Botão de Finalizar fica fixo na parte de baixo */}
      <View style={styles.finishButtonContainer}>
        <TouchableOpacity style={styles.finishButton} onPress={handleFinishPurchase}>
          <CheckCircle color="#fff" size={22} />
          <Text style={styles.finishButtonText}>Finalizar Compra</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Estilos unificados com o visual de cupom
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f4f8',
    },
    scrollContent: {
        padding: 15,
        paddingBottom: 100, // Espaço para o botão de finalizar
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
    finishButtonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 15,
        backgroundColor: '#f4f4f8', // Fundo combina com o container
    },
    finishButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
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