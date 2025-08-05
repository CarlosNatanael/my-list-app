import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import { Item } from '../_context/ListContext';

type AddItemData = Omit<Item, 'id' | 'price' | 'checked'>;

export const AddItemForm = ({ 
  isVisible, 
  onAdd, 
  onClose,
  categories,
}: { 
  isVisible: boolean, 
  onAdd: (item: AddItemData) => void,
  onClose: () => void,
  categories: string[],
}) => {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<'un' | 'kg'>('un');
  const [category, setCategory] = useState(categories[0]);

  useEffect(() => {
    if (isVisible) {
      setCategory(categories[0] || 'Outros');
    } else {
      setName('');
      setQuantity('');
      setUnit('un');
    }
  }, [isVisible, categories]);
  
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
    onAdd({ name, quantity: numQuantity, unit, category });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <KeyboardAvoidingView 
    behavior={Platform.OS == "android" ? "height" : "padding"}>
      <ScrollView style={[formStyles.addItemContainer, { paddingBottom: insets.bottom > 0 ? insets.bottom : 15 }]}>
          <TouchableOpacity style={formStyles.closeButton} onPress={onClose}>
              <X color="#555" size={24} />
          </TouchableOpacity>
          <View>
              <Text style={formStyles.formTitle}>Adicionar Item</Text>
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
              <Text style={formStyles.categoryTitle}>Categoria</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={formStyles.categoryScrollView}>
                  {categories.map(cat => (
                  <TouchableOpacity
                      key={cat}
                      style={[formStyles.categoryButton, category === cat && formStyles.categoryButtonSelected]}
                      onPress={() => setCategory(cat)}
                  >
                      <Text style={[formStyles.categoryText, category === cat && formStyles.categoryTextSelected]}>{cat}</Text>
                  </TouchableOpacity>
                  ))}
              </ScrollView>

              <TouchableOpacity style={formStyles.addButton} onPress={handleAddItem}>
                  <Text style={formStyles.addButtonText}>Adicionar Item</Text>
              </TouchableOpacity>
          </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const formStyles = StyleSheet.create({
    addItemContainer: {
      paddingHorizontal: 15,
      paddingTop: 15,
      backgroundColor: '#f0f0f0',
      borderTopWidth: 1,
      borderColor: '#ddd',
    },
    formTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15,
    },
    closeButton: {
        position: 'absolute',
        top: 15,
        right: 15,
        zIndex: 1,
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
      marginBottom: 10,
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
    categoryTitle: {
      fontSize: 14,
      color: '#666',
      marginBottom: 8,
    },
    categoryScrollView: {
      marginBottom: 15,
    },
    categoryButton: {
      backgroundColor: '#e0e0e0',
      paddingHorizontal: 15,
      paddingVertical: 8,
      borderRadius: 15,
      marginRight: 10,
    },
    categoryButtonSelected: {
      backgroundColor: '#007AFF',
    },
    categoryText: {
      fontSize: 14,
      color: '#333',
    },
    categoryTextSelected: {
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