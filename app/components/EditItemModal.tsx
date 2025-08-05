import { Modal, View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { X, Trash2 } from 'lucide-react-native'; // Importando o Trash2
import React, { useState, useEffect } from 'react';
import { Item } from '../context/ListContext';

type EditItemModalProps = {
  item: Item | null;
  visible: boolean;
  onClose: () => void;
  onSave: (name: string, quantity: number, unit: 'un' | 'kg') => void;
  onDelete: () => void; // Nova propriedade para deletar
};

export const EditItemModal = ({ item, visible, onClose, onSave, onDelete }: EditItemModalProps) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<'un' | 'kg'>('un');

  useEffect(() => {
    if (item) {
      setName(item.name);
      setQuantity(String(item.quantity));
      setUnit(item.unit);
    }
  }, [item]);

  if (!item) return null;

  const handleSave = () => {
    const numQuantity = parseFloat(quantity.replace(',', '.'));
    if (!name.trim() || !quantity.trim()) {
      Alert.alert('Atenção', 'Preencha o nome e a quantidade.');
      return;
    }
    if (isNaN(numQuantity) || numQuantity <= 0) {
      Alert.alert('Atenção', 'Insira uma quantidade válida.');
      return;
    }
    onSave(name, numQuantity, unit);
    onClose();
  };

  const handleDelete = () => {
    Alert.alert(
      "Excluir Item",
      `Tem certeza que deseja excluir "${item.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          onPress: () => {
            onDelete();
            onClose();
          },
          style: "destructive"
        },
      ]
    );
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalView}>
          <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
            <X color="#555" size={24} />
          </TouchableOpacity>
          <Text style={modalStyles.modalTitle}>Editar Item</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Nome do produto"
            value={name}
            onChangeText={setName}
            placeholderTextColor="#888"
          />
          <View style={modalStyles.quantityContainer}>
            <TextInput
              style={[modalStyles.input, { flex: 1 }]}
              placeholder="Qtde / Kg"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
              placeholderTextColor="#888"
            />
            <View style={modalStyles.unitSelector}>
              <TouchableOpacity
                style={[modalStyles.unitButton, unit === 'un' && modalStyles.unitButtonSelected]}
                onPress={() => setUnit('un')}
              >
                <Text style={[modalStyles.unitText, unit === 'un' && modalStyles.unitTextSelected]}>UN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[modalStyles.unitButton, unit === 'kg' && modalStyles.unitButtonSelected]}
                onPress={() => setUnit('kg')}
              >
                <Text style={[modalStyles.unitText, unit === 'kg' && modalStyles.unitTextSelected]}>KG</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={modalStyles.buttonRow}>
            <TouchableOpacity style={modalStyles.deleteButton} onPress={handleDelete}>
              <Trash2 color="#fff" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={modalStyles.saveButton} onPress={handleSave}>
              <Text style={modalStyles.saveButtonText}>Salvar Alterações</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const modalStyles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '90%',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
    },
    input: {
      width: '100%',
      backgroundColor: '#f0f0f0',
      paddingHorizontal: 15,
      paddingVertical: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#ccc',
      marginBottom: 15,
      fontSize: 16,
    },
    quantityContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      width: '100%',
      marginBottom: 20,
    },
    unitSelector: {
      flexDirection: 'row',
      backgroundColor: '#e0e0e0',
      borderRadius: 8,
    },
    unitButton: {
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    unitButtonSelected: {
      backgroundColor: '#007AFF',
      borderRadius: 8,
    },
    unitText: {
      fontSize: 16,
      color: '#333',
    },
    unitTextSelected: {
      color: '#fff',
      fontWeight: 'bold',
    },
    buttonRow: {
      flexDirection: 'row',
      width: '100%',
      gap: 10,
    },
    deleteButton: {
      backgroundColor: '#d9534f',
      padding: 15,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    saveButton: {
      backgroundColor: '#007AFF',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      flex: 1,
    },
    saveButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
    closeButton: {
      position: 'absolute',
      top: 15,
      right: 15,
    },
  });