import React, { useState } from 'react';
import { FlatList, StatusBar, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, ShoppingCart, Check, DollarSign, X } from 'lucide-react-native';
import { useList } from '../contexts/ListContext';
import { AddItemForm } from '../components/AddItemForm';
import { PriceModal } from '../components/PriceModal';
// As importações de React, componentes, hooks e ícones já estão no contexto acima.

// Defina o tipo Item se não estiver disponível globalmente
type Item = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price?: number;
};
export default function HomeScreen() {
  const { uncheckedItems, toggleItemChecked, updateItemPrice, totalPrice, checkedItemsCount } = useList();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isPriceModalVisible, setPriceModalVisible] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const openPriceModal = (item: Item) => {
    setSelectedItem(item);
    setPriceModalVisible(true);
  };

  const handleSavePrice = (price: number) => {
    if (selectedItem) {
      updateItemPrice(selectedItem.id, price);
    }
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.item}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetails}>
          {item.quantity} {item.unit} {item.price ? `- R$ ${item.price.toFixed(2)}` : ''}
        </Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity style={styles.iconButton} onPress={() => openPriceModal(item)}>
          <DollarSign color="#FF9500" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => toggleItemChecked(item.id)}>
          <Check color="#34C759" size={28} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <FlatList
        data={uncheckedItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Sua lista está vazia. Adicione um item!</Text>}
        contentContainerStyle={{ padding: 10, paddingBottom: 150 }}
      />
      
      <AddItemForm isVisible={isAddingItem} onAdd={() => setIsAddingItem(false)} />

      <TouchableOpacity style={styles.fab} onPress={() => setIsAddingItem(!isAddingItem)}>
        {isAddingItem ? <X color="#fff" size={28} /> : <Plus color="#fff" size={28} />}
      </TouchableOpacity>

      <View style={styles.footer}>
        <Link href="/cart" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <ShoppingCart color="#fff" size={22} />
            <Text style={styles.footerButtonText}>Carrinho ({checkedItemsCount})</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/cart" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <DollarSign color="#fff" size={22} />
            <Text style={styles.footerButtonText}>Total: R$ {totalPrice.toFixed(2)}</Text>
          </TouchableOpacity>
        </Link>
      </View>

      <PriceModal
        item={selectedItem}
        visible={isPriceModalVisible}
        onClose={() => setPriceModalVisible(false)}
        onSave={handleSavePrice}
      />
    </SafeAreaView>
  );
};

  // Estilos básicos para evitar erros de 'styles'
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f8f8f8',
      marginBottom: 10,
      borderRadius: 8,
      padding: 12,
      justifyContent: 'space-between',
    },
    itemInfo: {
      flex: 1,
    },
    itemName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    },
    itemDetails: {
      fontSize: 14,
      color: '#666',
    },
    itemActions: {
      flexDirection: 'row',
      alignItems: 'center',
      marginLeft: 10,
    },
    iconButton: {
      marginLeft: 8,
      padding: 4,
    },
    fab: {
      position: 'absolute',
      right: 24,
      bottom: 100,
      backgroundColor: '#007AFF',
      borderRadius: 28,
      width: 56,
      height: 56,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
    },
    footer: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'row',
      backgroundColor: '#007AFF',
      padding: 16,
      justifyContent: 'space-between',
    },
    footerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: '#005BBB',
      borderRadius: 8,
      marginHorizontal: 4,
    },
    footerButtonText: {
      color: '#fff',
      fontSize: 16,
      marginLeft: 8,
      fontWeight: 'bold',
    },
    emptyText: {
      textAlign: 'center',
      color: '#999',
      fontSize: 16,
      marginTop: 40,
    },
  });