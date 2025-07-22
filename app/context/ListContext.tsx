import React, { useState, createContext, useContext, useMemo, useCallback } from 'react';

// Define a estrutura de um item da lista
export type Item = {
  id: string;
  name: string;
  quantity: number;
  unit: 'un' | 'kg';
  price?: number;
  checked: boolean;
};

// Define o que será compartilhado pelo nosso contexto
type ListContextType = {
  items: Item[];
  addItem: (item: Omit<Item, 'id' | 'checked'>) => void;
  toggleItemChecked: (id: string) => void;
  updateItemPrice: (id: string, price: number) => void;
  clearList: () => void;
  uncheckedItems: Item[];
  checkedItems: Item[];
  totalPrice: number;
  checkedItemsCount: number;
};

// Cria o contexto
const ListContext = createContext<ListContextType | undefined>(undefined);

// Hook customizado para facilitar o uso do contexto
export const useList = () => {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error('useList deve ser usado dentro de um ListProvider');
  }
  return context;
};

// Componente Provedor do Contexto
export const ListProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<Item[]>([]);

  const addItem = useCallback((item: Omit<Item, 'id' | 'checked'>) => {
    setItems(prevItems => [
      { ...item, id: Date.now().toString(), checked: false },
      ...prevItems,
    ]);
  }, []);

  const toggleItemChecked = useCallback((id: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  }, []);

  const updateItemPrice = useCallback((id: string, price: number) => {
    setItems(prevItems =>
      prevItems.map(item => (item.id === id ? { ...item, price } : item))
    );
  }, []);

  const clearList = useCallback(() => {
    setItems([]);
  }, []);

  // Filtra itens que ainda não foram para o carrinho
  const uncheckedItems = useMemo(() => items.filter(item => !item.checked), [items]);
  // Filtra itens que já estão no carrinho
  const checkedItems = useMemo(() => items.filter(item => item.checked), [items]);

  // Calcula o preço total de todos os itens
  const totalPrice = useMemo(() =>
    items.reduce((total, item) => {
      const itemPrice = item.price || 0;
      return total + itemPrice * item.quantity;
    }, 0),
    [items]
  );
  
  const checkedItemsCount = useMemo(() => checkedItems.length, [checkedItems]);

  const value = {
    items,
    addItem,
    toggleItemChecked,
    updateItemPrice,
    clearList,
    uncheckedItems,
    checkedItems,
    totalPrice,
    checkedItemsCount,
  };

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
};