import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { useList } from '../context/ListContext';

export const AddItemForm = ({ isVisible, onAdd }: { isVisible: boolean, onAdd: () => void }) => {
  const { addItem } = useList();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<'un' | 'kg'>('un');

  const handleAddItem = () => {
    if (!name.trim() || !quantity.trim()) {
      Alert.alert('Atenção', 'Preencha o nome e a quantidade.');
      return;
    }
    const numQuantity = parseFloat(quantity.replace(',', '.'));
    if (isNaN(numQuantity) || numQuantity <= 0) {
      Alert.alert('Atenção', 'Insira uma quantidade válida.');
      return;
    }
    addItem({ name, quantity: numQuantity, unit });
    setName('');
    setQuantity('');
    setUnit('un');
    onAdd(); // Fecha o formulário
  };

  if (!isVisible) {
    return null;
  }

  return (
    <View style={formStyles.addItemContainer}>
      <TextInput
        style={formStyles.input}
        placeholder="Nome do produto"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#888"
      />
      <View style={formStyles.quantityContainer}>
        <TextInput
          style={[formStyles.input, { flex: 1 }]}
          placeholder="Qtde / Kg"
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
          placeholderTextColor="#888"
        />
        <View style={formStyles.unitSelector}>
          <TouchableOpacity
            style={[formStyles.unitButton, unit === 'un' && formStyles.unitButtonSelected]}
            onPress={() => setUnit('un')}
          >
            <Text style={[formStyles.unitText, unit === 'un' && formStyles.unitTextSelected]}>UN</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[formStyles.unitButton, unit === 'kg' && formStyles.unitButtonSelected]}
            onPress={() => setUnit('kg')}
          >
            <Text style={[formStyles.unitText, unit === 'kg' && formStyles.unitTextSelected]}>KG</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={formStyles.addButton} onPress={handleAddItem}>
        <Text style={formStyles.addButtonText}>Adicionar Item</Text>
      </TouchableOpacity>
    </View>
  );
};

const formStyles = StyleSheet.create({
  addItemContainer: {
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
