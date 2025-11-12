import React, { useState } from 'react';
import { SectionList, StatusBar, View, Text, TouchableOpacity, StyleSheet, Share, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, Stack } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, ShoppingCart, DollarSign, Pencil, Menu, Share2, Check } from 'lucide-react-native';
import { useList, Item } from '../context/ListContext';
import { AddItemForm } from '../components/AddItemForm';
import { PriceModal } from '../components/PriceModal';
import { EditItemModal } from '../components/EditItemModal';
import { MenuModal } from '../components/MenuModal';

export default function ListScreen() {
  const { 
    items,
    uncheckedItemsByCategory, 
    toggleItemChecked, 
    updateItemPrice, 
    checkedItemsTotalPrice, 
    checkedItemsCount, 
    updateItem, 
    deleteItem,
    addItem,
    activeCategories
  } = useList();
  
  const insets = useSafeAreaInsets();

  const [itemForPrice, setItemForPrice] = useState<Item | null>(null);
  const [itemForEdit, setItemForEdit] = useState<Item | null>(null);
  const [isPriceModalVisible, setPriceModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);

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


  const handleAddItem = (itemData: Omit<Item, 'id' | 'price' | 'checked'>) => {
    addItem(itemData);
    setIsAddingItem(false);
  };

  const onShare = async () => {
    try {
      let message = "Minha Lista de Compras (via Buy Fast):\n\n";
      uncheckedItemsByCategory.forEach(section => {
        message += `*${section.title}*\n`;
        section.data.forEach(item => {
          message += `- ${item.name} (${item.quantity} ${item.unit})\n`;
        });
        message += '\n';
      });

      await Share.share({ message });
    } catch (error: any) {
      Alert.alert(error.message);
    }
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
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20, marginRight: 15 }}>
              {items.length > 0 && (
                <TouchableOpacity onPress={onShare}>
                  <Share2 color="#007AFF" size={24} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setMenuVisible(true)}>
                <Menu color="#007AFF" size={28} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <StatusBar barStyle="dark-content" />
      <MenuModal visible={isMenuVisible} onClose={() => setMenuVisible(false)} />
      
      <SectionList
        style={{flex: 1}}
        sections={uncheckedItemsByCategory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title } }) => <Text style={styles.sectionHeader}>{title}</Text>}
        ListEmptyComponent={<Text style={styles.emptyText}>Sua lista está vazia. Adicione um item!</Text>}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 150 }}
        stickySectionHeadersEnabled={false}
      />
      {!isAddingItem && (
        <>
          <View style={[styles.footer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16, height: 60 + insets.bottom }]}>
            <Link href="/cart" asChild><TouchableOpacity style={styles.footerButton}><ShoppingCart color="#fff" size={22} /><Text style={styles.footerButtonText}>Carrinho ({checkedItemsCount})</Text></TouchableOpacity></Link>
            <Link href="/total" asChild><TouchableOpacity style={styles.footerButton}><DollarSign color="#fff" size={22} /><Text style={styles.footerButtonText}>Total: R$ {checkedItemsTotalPrice.toFixed(2)}</Text></TouchableOpacity></Link>
          </View>
          <TouchableOpacity style={[styles.fab, { bottom: 80 + insets.bottom }]} onPress={() => setIsAddingItem(true)}><Plus color="#fff" size={28} /></TouchableOpacity>
        </>
      )}
      {isAddingItem && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 10 }]}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'android' ? 'height' : 'padding'}
            keyboardVerticalOffset={Platform.OS === 'android' ? 64 : 0}>
            <SafeAreaView style={{ flex: 1, justifyContent: 'flex-end' }}>
              <AddItemForm
                isVisible={isAddingItem}
                onAdd={handleAddItem}
                onClose={() => setIsAddingItem(false)}
                categories={activeCategories}
              />
            </SafeAreaView>
          </KeyboardAvoidingView>
        </View>
      )}
      <PriceModal item={itemForPrice} visible={isPriceModalVisible} onClose={() => setPriceModalVisible(false)} onSave={handleSavePrice} />
      <EditItemModal item={itemForEdit} visible={isEditModalVisible} onClose={() => setEditModalVisible(false)} onSave={handleSaveItem} onDelete={handleDeleteItem} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    keyboardAvoider: {
      bottom: 0,
      left: 0,
      right: 0,
    },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#333', backgroundColor: '#f9f9f9', paddingTop: 15, paddingBottom: 5, paddingHorizontal: 10 },
    item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8', marginBottom: 10, borderRadius: 8, padding: 12, justifyContent: 'space-between' },
    itemInfo: { flex: 1 },
    itemName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    itemDetails: { fontSize: 14, color: '#666' },
    itemActions: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
    iconButton: { marginLeft: 8, padding: 4 },
    fab: { position: 'absolute', right: 24, backgroundColor: '#007AFF', borderRadius: 28, width: 56, height: 56, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: '#007AFF', paddingTop: 10, paddingHorizontal: 16, justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#005BBB' },
    footerButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#005BBB', borderRadius: 8, marginHorizontal: 4 },
    footerButtonText: { color: '#fff', fontSize: 16, marginLeft: 8, fontWeight: 'bold' },
    emptyText: { textAlign: 'center', color: '#999', fontSize: 16, marginTop: 40 },
});