import React, { useState } from 'react';
import { SafeAreaView, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useList } from './context/ListContext';
import { useRouter } from 'expo-router';
import { Save } from 'lucide-react-native';

export default function SaveTemplateScreen() {
  const [name, setName] = useState('');
  const { saveListAsTemplate, items } = useList();
  const router = useRouter();

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert("Atenção", "Por favor, dê um nome para a sua lista.");
      return;
    }
    if (items.length === 0) {
        Alert.alert("Atenção", "Sua lista de compras está vazia.");
        return;
    }
    await saveListAsTemplate(name);
    Alert.alert("Sucesso", `Lista "${name}" salva como modelo!`);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Salvar Lista como Modelo</Text>
      <Text style={styles.subtitle}>
        Salve a sua lista atual para reutilizá-la em compras futuras.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Compras do Mês, Churrasco..."
        value={name}
        onChangeText={setName}
        placeholderTextColor="#888"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Save color="#fff" size={20} />
        <Text style={styles.saveButtonText}>Salvar Lista</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  input: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 16,
    marginBottom: 20,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
});