import { Modal } from 'react-native';
import { X } from 'lucide-react-native';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';

// Define the Item type if not imported from elsewhere
type Item = {
  name: string;
  price?: number;
  // add other properties as needed
};

export const PriceModal = ({ item, visible, onClose, onSave }: { item: Item | null, visible: boolean, onClose: () => void, onSave: (price: number) => void }) => {
  const [price, setPrice] = useState('');

  // Atualiza o estado do preço quando o item selecionado muda
  React.useEffect(() => {
    if (item && item.price) {
      setPrice(String(item.price));
    } else {
      setPrice('');
    }
  }, [item]);

  if (!item) return null;

  const handleSave = () => {
    const numPrice = parseFloat(price.replace(',', '.'));
    if (!isNaN(numPrice) && numPrice >= 0) {
      onSave(numPrice);
      onClose();
    } else {
      Alert.alert('Atenção', 'Por favor, insira um preço válido.');
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={modalStyles.modalOverlay}>
        <View style={modalStyles.modalView}>
          <TouchableOpacity style={modalStyles.closeButton} onPress={onClose}>
            <X color="#555" size={24} />
          </TouchableOpacity>
          <Text style={modalStyles.modalTitle}>Adicionar Preço</Text>
          <Text style={modalStyles.modalItemName}>{item.name}</Text>
          <TextInput
            style={modalStyles.input}
            placeholder="Preço (R$)"
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
            autoFocus
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={modalStyles.addButton} onPress={handleSave}>
            <Text style={modalStyles.addButtonText}>Salvar Preço</Text>
          </TouchableOpacity>
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
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalItemName: {
    fontSize: 16,
    marginBottom: 15,
    color: '#555',
  },
  input: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});