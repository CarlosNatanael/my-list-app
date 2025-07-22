import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyText: {
    fontSize: 18,
    color: '#333',
  },
});

export default function TotalScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.emptyText}>Tela de Total</Text>
    </SafeAreaView>
  );
};