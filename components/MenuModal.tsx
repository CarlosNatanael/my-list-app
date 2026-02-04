import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { useList } from '../context/ListContext';
import { Trash2, Save, ListPlus, History, X, Settings, FileUp, FileDown } from 'lucide-react-native';

type MenuModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const MenuModal = ({ visible, onClose }: MenuModalProps) => {
  const router = useRouter();
  const { clearActiveList, exportList, importList } = useList();

  const handleClearList = () => {
    onClose();
    clearActiveList();
  };

  const handleExport = async () => {
    const json = exportList();
    await Clipboard.setStringAsync(json);
    Alert.alert("Exportar", "Lista copiada para a área de transferência!");
    onClose();
  };

  const handleImport = async () => {
    const text = await Clipboard.getStringAsync();
    if (!text) {
      Alert.alert("Erro", "A área de transferência está vazia.");
      return;
    }
    importList(text);
    onClose();
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
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

          <TouchableOpacity style={styles.optionButton} onPress={handleExport}>
            <FileDown color="#34C759" size={24} />
            <Text style={styles.optionText}>Exportar Lista (JSON)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={handleImport}>
            <FileUp color="#FF9500" size={24} />
            <Text style={styles.optionText}>Importar Lista (JSON)</Text>
          </TouchableOpacity>
          
          <View style={styles.separator} />

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
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalView: { backgroundColor: 'white', borderRadius: 20, padding: 25, width: '85%', elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  optionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  optionText: { fontSize: 18, marginLeft: 15, color: '#333' },
  closeButton: { position: 'absolute', top: 15, right: 15 },
  separator: { height: 1, backgroundColor: '#eee', marginVertical: 10 }
});