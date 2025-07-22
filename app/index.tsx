import React from 'react';
import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Tela Inicial</Text>
      <Link href="/cart" asChild>
        <Button title="Ir para o Carrinho" />
      </Link>
    </View>
  );
}