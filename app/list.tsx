import React, { useState } from 'react';
import { SectionList, StatusBar, View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Link } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, ShoppingCart, Check, DollarSign, X, Pencil } from 'lucide-react-native';
import { useList, Item } from './_context/ListContext';
import { AddItemForm } from './_components/AddItemForm';
import { PriceModal } from './_components/PriceModal';
import { EditItemModal } from './_components/EditItemModal';

export default function ListScreen() {
  const { 
    uncheckedItemsByCategory, 
    toggleItemChecked, 
    updateItemPrice, 
    checkedItemsTotalPrice, 
    checkedItemsCount, 
    updateItem, 
    deleteItem 
  } = useList();
  
  const insets = useSafeAreaInsets();

  const [itemForPrice, setItemForPrice] = useState<Item | null>(null);
  const [itemForEdit, setItemForEdit] = useState<Item | null>(null);
  const [isPriceModalVisible, setPriceModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);

  const handleSavePrice = (price: number) => {
    if (itemForPrice) updateItemPrice(itemForPrice.id, price);
  };

  const handleSaveItem = (name: string, quantity: number, unit: 'un' | 'kg') => {
    if (itemForEdit) updateItem(itemForEdit.id, name, quantity, unit);
  };

  const handleDeleteItem = () => {
    if (itemForEdit) deleteItem(itemForEdit.id);
  };
  
  const openPriceModal = (item: Item) => {
    setItemForPrice(item);
    setPriceModalVisible(true);
  };
  
  const openEditModal = (item: Item) => {
    setItemForEdit(item);
    setEditModalVisible(true);
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.item}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetails}>{item.quantity} {item.unit} {item.price ? `- R$ ${item.price.toFixed(2)}` : ''}</Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity style={styles.iconButton} onPress={() => openEditModal(item)}><Pencil color="#007AFF" size={24} /></TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => openPriceModal(item)}><DollarSign color="#FF9500" size={24} /></TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => toggleItemChecked(item.id)}><Check color="#34C759" size={28} /></TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SectionList
        sections={uncheckedItemsByCategory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>Sua lista está vazia. Adicione um item!</Text>}
        contentContainerStyle={{ padding: 10, paddingBottom: 150 }}
        stickySectionHeadersEnabled={false}
      />
      
      <AddItemForm isVisible={isAddingItem} onAdd={() => setIsAddingItem(false)} />

      {!isAddingItem && (
        <>
          <View style={[styles.footer, { bottom: insets.bottom }]}>
            <Link href="/cart" asChild><TouchableOpacity style={styles.footerButton}><ShoppingCart color="#fff" size={22} /><Text style={styles.footerButtonText}>Carrinho ({checkedItemsCount})</Text></TouchableOpacity></Link>
            <Link href="/total" asChild><TouchableOpacity style={styles.footerButton}><DollarSign color="#fff" size={22} /><Text style={styles.footerButtonText}>Total: R$ {checkedItemsTotalPrice.toFixed(2)}</Text></TouchableOpacity></Link>
          </View>
          <TouchableOpacity style={[styles.fab, { bottom: 80 + insets.bottom }]} onPress={() => setIsAddingItem(true)}><Plus color="#fff" size={28} /></TouchableOpacity>
        </>
      )}

      {isAddingItem && (
         <TouchableOpacity style={[styles.closeFab, { bottom: 295 + insets.bottom }]} onPress={() => setIsAddingItem(false)}><X color="#fff" size={28} /></TouchableOpacity>
      )}

      <PriceModal item={itemForPrice} visible={isPriceModalVisible} onClose={() => setPriceModalVisible(false)} onSave={handleSavePrice} />
      <EditItemModal item={itemForEdit} visible={isEditModalVisible} onClose={() => setEditModalVisible(false)} onSave={handleSaveItem} onDelete={handleDeleteItem} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#333', backgroundColor: '#fff', paddingTop: 15, paddingBottom: 5, paddingHorizontal: 5 },
    item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8', marginBottom: 10, borderRadius: 8, padding: 12, justifyContent: 'space-between' },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    itemDetails: { fontSize: 14, color: '#666' },
    itemActions: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
    iconButton: { marginLeft: 8, padding: 4 },
    fab: { position: 'absolute', right: 24, backgroundColor: '#007AFF', borderRadius: 28, width: 56, height: 56, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 },
    closeFab: { position: 'absolute', right: 24, backgroundColor: '#007AFF', borderRadius: 28, width: 56, height: 56, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 },
    footer: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', backgroundColor: '#007AFF', padding: 16, justifyContent: 'space-between' },
    footerButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#005BBB', borderRadius: 8, marginHorizontal: 4 },
    footerButtonText: { color: '#fff', fontSize: 16, marginLeft: 8, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', color: '#999', fontSize: 16, marginTop: 40 },
});