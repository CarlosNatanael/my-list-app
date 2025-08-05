import React from 'react';
import { SafeAreaView, Text, StyleSheet, FlatList, View, TouchableOpacity, Alert } from 'react-native';
import { useList } from './context/ListContext';
import { useRouter } from 'expo-router';
import { Check, Trash2, Pencil } from 'lucide-react-native';
import { SavedList } from './context/ListContext';

export default function TemplatesScreen() {
  const { savedLists, loadListFromTemplate, deleteTemplate } = useList();
  const router = useRouter();

  const handleUseList = (list: SavedList) => {
    Alert.alert(
      "Carregar Lista",
      `Deseja usar a lista "${list.name}"? Sua lista atual será substituída.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Usar",
          onPress: () => {
            loadListFromTemplate(list.id);
            router.back();
          },
        },
      ]
    );
  };

  const handleDelete = (list: SavedList) => {
    Alert.alert(
      "Excluir Lista",
      `Tem certeza que deseja excluir a lista "${list.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: () => deleteTemplate(list.id),
          style: "destructive"
        },
      ]
    );
  };

  const handleEdit = (listId: string) => {
    router.push({ pathname: '/edit-template', params: { listId } });
  };
  
  const renderItem = ({ item }: { item: SavedList }) => (
    <View style={styles.item}>
      <Text style={styles.itemName}>{item.name}</Text>
      <View style={styles.itemActions}>
        <TouchableOpacity style={styles.iconButton} onPress={() => handleUseList(item)}>
          <Check color="#34C759" size={26} />
        </TouchableOpacity>
        {/* NOVO BOTÃO DE EDITAR */}
        <TouchableOpacity style={styles.iconButton} onPress={() => handleEdit(item.id)}>
          <Pencil color="#007AFF" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => handleDelete(item)}>
          <Trash2 color="#d9534f" size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={savedLists}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Nenhuma lista salva como modelo.</Text>}
        contentContainerStyle={{ padding: 10 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  itemName: { fontSize: 18, fontWeight: 'bold' },
  itemActions: { flexDirection: 'row' },
  iconButton: { marginLeft: 20 },
  emptyText: { textAlign: 'center', color: '#999', fontSize: 16, marginTop: 40 },
});