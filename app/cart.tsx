import React, { useState, useMemo } from 'react';
import { SafeAreaView, Text, StyleSheet, FlatList, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useList } from './_context/ListContext';
import { Search, Trash2, Pencil } from 'lucide-react-native';
import { EditItemModal } from './_components/EditItemModal';
import { Item } from './_context/ListContext';

export default function CartScreen() {
  const { checkedItems, deleteItem, updateItem } = useList();
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [itemForEdit, setItemForEdit] = useState<Item | null>(null);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return checkedItems;
    }
    return checkedItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [checkedItems, searchQuery]);

  const openEditModal = (item: Item) => {
    setItemForEdit(item);
    setEditModalVisible(true);
  };

  const handleSaveItem = (name: string, quantity: number, unit: 'un' | 'kg') => {
    if (itemForEdit) {
      updateItem(itemForEdit.id, name, quantity, unit);
    }
  };

  const handleDeleteItem = (id: string, name: string) => {
    Alert.alert(
      "Excluir Item",
      `Tem certeza que deseja excluir "${name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: () => deleteItem(id),
          style: "destructive"
        },
      ]
    );
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
        <TouchableOpacity style={styles.iconButton} onPress={() => openEditModal(item)}>
          <Pencil color="#007AFF" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => handleDeleteItem(item.id, item.name)}>
          <Trash2 color="#d9534f" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Search color="#888" size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar no carrinho..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
        />
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Seu carrinho está vazio.</Text>}
        contentContainerStyle={{ padding: 10 }}
      />
      
      {/* O MODAL DE EDIÇÃO AGORA EXISTE AQUI TAMBÉM */}
      <EditItemModal
        item={itemForEdit}
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveItem}
        onDelete={() => {
          if (itemForEdit) {
            deleteItem(itemForEdit.id);
          }
        }}
      />
    </SafeAreaView>
  );
};

// ... (Estilos permanecem os mesmos da resposta anterior)
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      margin: 10,
      paddingHorizontal: 10,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      paddingVertical: 10,
      fontSize: 16,
      color: '#333',
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
      marginTop: 4,
    },
    itemActions: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconButton: {
      marginLeft: 15,
    },
    emptyText: {
      textAlign: 'center',
      color: '#999',
      fontSize: 16,
      marginTop: 40,
    },
  });