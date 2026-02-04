import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import { useList } from '../context/ListContext';
import { X, GripVertical, Check } from 'lucide-react-native';

export default function CategoriesScreen() {
  const { activeCategories, updateCategories, activeListType } = useList();
  const [localCategories, setLocalCategories] = useState(activeCategories);
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      Alert.alert("Atenção", "O nome da categoria não pode ser vazio.");
      return;
    }
    if (localCategories.includes(newCategoryName.trim())) {
      Alert.alert("Atenção", "Esta categoria já existe.");
      return;
    }
    setLocalCategories([...localCategories, newCategoryName.trim()]);
    setNewCategoryName('');
  };

  const handleDeleteCategory = (index: number) => {
    const newCats = [...localCategories];
    newCats.splice(index, 1);
    setLocalCategories(newCats);
  };

  const handleSaveChanges = () => {
    updateCategories(localCategories);
    Alert.alert("Sucesso", "Suas categorias foram salvas!");
  };

  const renderItem = ({ item, drag, isActive }: any) => (
    <ScaleDecorator>
      <TouchableOpacity
        onLongPress={drag}
        disabled={isActive}
        style={[styles.item, { backgroundColor: isActive ? '#e0e0e0' : '#f8f8f8' }]}
      >
        <GripVertical color="#999" size={24} />
        <Text style={styles.itemText}>{item}</Text>
        <TouchableOpacity onPress={() => handleDeleteCategory(localCategories.indexOf(item))}>
          <X color="#d9534f" size={22} />
        </TouchableOpacity>
      </TouchableOpacity>
    </ScaleDecorator>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Gerenciar Categorias</Text>
      <Text style={styles.subtitle}>Arraste para reordenar, adicione ou remova categorias para a lista de {activeListType}.</Text>

      <DraggableFlatList
        data={localCategories}
        onDragEnd={({ data }) => setLocalCategories(data)}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        containerStyle={{ flex: 1 }}
      />

      <View style={styles.addContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nova categoria"
          value={newCategoryName}
          onChangeText={setNewCategoryName}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <Text style={styles.addButtonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Check color="#fff" size={22} />
        <Text style={styles.saveButtonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 15 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginVertical: 15 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 15, marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  itemText: { flex: 1, fontSize: 18, marginLeft: 10 },
  addContainer: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 15 },
  input: { flex: 1, backgroundColor: '#f0f0f0', padding: 12, borderRadius: 8, fontSize: 16 },
  addButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8 },
  addButtonText: { color: '#fff', fontWeight: 'bold' },
  saveButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4CAF50', padding: 16, borderRadius: 8, marginTop: 20 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});