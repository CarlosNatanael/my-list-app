import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, StyleSheet, View, TextInput, TouchableOpacity, Alert, SectionList, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useList, Item } from './_context/ListContext';
import { AddItemForm } from './_components/AddItemForm';
import { Check, X, Plus } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TemplateItem = Omit<Item, 'id' | 'price' | 'checked'>;

export default function EditTemplateScreen() {
  const router = useRouter();
  const { listId } = useLocalSearchParams<{ listId: string }>();
  const { savedLists, updateTemplate, activeCategories } = useList();
  const insets = useSafeAreaInsets();
  
  const [listName, setListName] = useState('');
  const [items, setItems] = useState<TemplateItem[]>([]);
  const [isAddingItem, setIsAddingItem] = useState(false);

  useEffect(() => {
    const listToEdit = savedLists.find(l => l.id === listId);
    if (listToEdit) {
      setListName(listToEdit.name);
      setItems(listToEdit.items);
    }
  }, [listId, savedLists]);

  const handleAddItem = (item: TemplateItem) => {
    setItems(prev => [item, ...prev]);
    setIsAddingItem(false);
  };
  
  const handleDeleteItem = (index: number) => {
    Alert.alert(
      "Remover Item",
      "Tem certeza que deseja remover este item do modelo?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover", onPress: () => {
            const newItems = [...items];
            newItems.splice(index, 1);
            setItems(newItems);
        }, style: "destructive" },
      ]
    );
  };

  const handleSaveChanges = async () => {
    if (!listName.trim()) {
        Alert.alert("Atenção", "O nome da lista não pode ser vazio.");
        return;
    }
    if (!listId) return;

    await updateTemplate(listId, listName, items);
    Alert.alert("Sucesso", "Modelo de lista atualizado!");
    router.back();
  };

  const renderItem = ({ item, index }: { item: TemplateItem, index: number }) => (
    <View style={styles.item}>
      <View style={{flex: 1}}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetails}>{item.quantity} {item.unit} - {item.category}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDeleteItem(index)}>
        <X color="#d9534f" size={22} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Stack.Screen options={{ title: "Editar Modelo" }} />
      
      <View style={styles.header}>
          <TextInput
          style={styles.listNameInput}
          value={listName}
          onChangeText={setListName}
          placeholder="Nome da Lista"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
              <Check size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
      </View>

      <SectionList
          style={{ flex: 1 }}
          sections={[{ title: 'Itens', data: items }]}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.name + index}
          ListEmptyComponent={<Text style={styles.emptyText}>Nenhum item no modelo.</Text>}
          contentContainerStyle={{ paddingBottom: 100 }}
      />
      
      {isAddingItem && (
        <KeyboardAvoidingView
          style={styles.keyboardAvoider}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <AddItemForm 
              isVisible={isAddingItem} 
              onAdd={handleAddItem} 
              onClose={() => setIsAddingItem(false)}
              categories={activeCategories}
          />
        </KeyboardAvoidingView>
      )}

      {!isAddingItem && (
        <TouchableOpacity style={[styles.fab, { bottom: 20 + insets.bottom }]} onPress={() => setIsAddingItem(true)}>
            <Plus color="#fff" size={28} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  keyboardAvoider: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee', flexDirection: 'row', gap: 10, alignItems: 'center' },
  listNameInput: { fontSize: 18, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 8, flex: 1 },
  item: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#f8f8f8', borderBottomWidth: 1, borderBottomColor: '#eee' },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemDetails: { fontSize: 14, color: '#666' },
  emptyText: { textAlign: 'center', marginTop: 30, color: '#999', fontSize: 16 },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4CAF50', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 8 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  fab: { position: 'absolute', right: 24, backgroundColor: '#007AFF', borderRadius: 28, width: 56, height: 56, alignItems: 'center', justifyContent: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 },
});