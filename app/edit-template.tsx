import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, TextInput, TouchableOpacity, Alert, SectionList } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useList, Item } from './_context/ListContext';
import { AddItemForm } from './_components/AddItemForm'; // Reutilizaremos o formulário
import { Check, Pencil, X, DollarSign } from 'lucide-react-native';

// Este componente é uma versão simplificada da sua tela de lista, focado na edição
export default function EditTemplateScreen() {
  const router = useRouter();
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const { savedLists, updateTemplate, activeCategories } = useList();
  
  const [listName, setListName] = useState('');
  const [items, setItems] = useState<Omit<Item, 'id' | 'price' | 'checked'>[]>([]);

  useEffect(() => {
    const listToEdit = savedLists.find(l => l.id === listId);
    if (listToEdit) {
      setListName(listToEdit.name);
      setItems(listToEdit.items);
    }
  }, [listId, savedLists]);

  const handleAddItem = (item: Omit<Item, 'id' | 'checked'>) => {
    setItems(prev => [item, ...prev]);
  };
  
  const handleDeleteItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSaveChanges = async () => {
    if (!listId) return;
    await updateTemplate(listId, listName, items);
    Alert.alert("Sucesso", "Modelo de lista atualizado!");
    router.back();
  };

  const renderItem = ({ item, index }: { item: Omit<Item, 'id' | 'price' | 'checked'>, index: number }) => (
    <View style={styles.item}>
      <Text style={styles.itemName}>{item.name} ({item.quantity} {item.unit})</Text>
      <TouchableOpacity onPress={() => handleDeleteItem(index)}>
        <X color="#d9534f" size={22} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: "Editar Modelo" }} />
      <View style={styles.header}>
        <TextInput
          style={styles.listNameInput}
          value={listName}
          onChangeText={setListName}
          placeholder="Nome da Lista"
        />
      </View>

      <SectionList
        sections={[{ title: 'Itens', data: items }]}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.name + index}
        ListEmptyComponent={<Text style={styles.emptyText}>Adicione itens a esta lista.</Text>}
        style={{ flex: 1 }}
      />
      
      {/* Usamos um AddItemForm simplificado para adicionar itens ao template */}
      <AddItemForm isVisible={true} onAdd={() => {}} /> 

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Check size={22} color="#fff" />
        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  listNameInput: { fontSize: 22, fontWeight: 'bold', padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#f8f8f8', borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemName: { fontSize: 16 },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#999' },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4CAF50', padding: 16, margin: 15, borderRadius: 8 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});