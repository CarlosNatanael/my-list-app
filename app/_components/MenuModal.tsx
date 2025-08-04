import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useList } from '../_context/ListContext';
import { Trash2, Save, ListPlus, History, X, Settings } from 'lucide-react-native';

type MenuModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const MenuModal = ({ visible, onClose }: MenuModalProps) => {
  const router = useRouter();
  const { clearActiveList } = useList();

  const handleClearList = () => {
    onClose();
    clearActiveList();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X color="#555" size={24} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Opções da Lista</Text>
          
          <TouchableOpacity style={styles.optionButton} onPress={() => { onClose(); router.push('/categories'); }}>
            <Settings color="#007AFF" size={24} />
            <Text style={styles.optionText}>Gerenciar Categorias</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={() => { onClose(); router.push('/save-template'); }}>
            <Save color="#007AFF" size={24} />
            <Text style={styles.optionText}>Salvar como Modelo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={() => { onClose(); router.push('/templates'); }}>
            <ListPlus color="#007AFF" size={24} />
            <Text style={styles.optionText}>Usar Lista Modelo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionButton} onPress={() => { onClose(); router.push('/history'); }}>
            <History color="#007AFF" size={24} />
            <Text style={styles.optionText}>Histórico de Compras</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={handleClearList}>
            <Trash2 color="#d9534f" size={24} />
            <Text style={styles.optionText}>Limpar Lista Atual</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  optionText: {
    fontSize: 18,
    marginLeft: 15,
    color: '#333',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
});