import React, { useState, createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Estrutura de um item
export type Item = {
  id: string;
  name: string;
  quantity: number;
  unit: 'un' | 'kg';
  price?: number;
  checked: boolean;
};

// Nova estrutura para uma compra salva
export type Purchase = {
  id: string;
  storeName: string;
  date: string;
  totalPrice: number;
  items: Item[];
};

type ListContextType = {
  items: Item[];
  addItem: (item: Omit<Item, 'id' | 'checked'>) => void;
  toggleItemChecked: (id: string) => void;
  updateItemPrice: (id: string, price: number) => void;
  updateItem: (id: string, name: string, quantity: number, unit: 'un' | 'kg') => void;
  deleteItem: (id: string) => void;
  savePurchase: (storeName: string) => Promise<void>;
  purchaseHistory: Purchase[];
  uncheckedItems: Item[];
  checkedItems: Item[];
  totalPrice: number;
  checkedItemsTotalPrice: number; // Novo total para itens no carrinho
  checkedItemsCount: number;
};

const ListContext = createContext<ListContextType | undefined>(undefined);

export const useList = () => {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error('useList deve ser usado dentro de um ListProvider');
  }
  return context;
};

export const ListProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem('@purchaseHistory');
        if (savedHistory !== null) {
          setPurchaseHistory(JSON.parse(savedHistory));
        }
      } catch (e) {
        console.error('Falha ao carregar o histórico de compras.', e);
      }
    };
    loadHistory();
  }, []);

  const addItem = useCallback((item: Omit<Item, 'id' | 'checked'>) => {
    setItems(prevItems => [{ ...item, id: Date.now().toString(), checked: false }, ...prevItems]);
  }, []);

  const toggleItemChecked = useCallback((id: string) => {
    setItems(prevItems => prevItems.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  }, []);

  const updateItemPrice = useCallback((id: string, price: number) => {
    setItems(prevItems => prevItems.map(item => (item.id === id ? { ...item, price } : item)));
  }, []);

  const updateItem = useCallback((id: string, name: string, quantity: number, unit: 'un' | 'kg') => {
    setItems(prevItems => prevItems.map(item => item.id === id ? { ...item, name, quantity, unit } : item));
  }, []);
  
  const deleteItem = useCallback((id: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  }, []);

  const clearList = useCallback(() => {
    setItems([]);
  }, []);

  const savePurchase = useCallback(async (storeName: string) => {
    const newPurchase: Purchase = {
      id: Date.now().toString(),
      storeName: storeName || 'Local não informado',
      date: new Date().toLocaleDateString('pt-BR'),
      totalPrice: items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0),
      items: [...items],
    };

    try {
      const updatedHistory = [newPurchase, ...purchaseHistory];
      setPurchaseHistory(updatedHistory);
      await AsyncStorage.setItem('@purchaseHistory', JSON.stringify(updatedHistory));
      clearList();
    } catch (e) {
      console.error('Falha ao salvar a compra.', e);
    }
  }, [items, purchaseHistory, clearList]);

  const uncheckedItems = useMemo(() => items.filter(item => !item.checked), [items]);
  const checkedItems = useMemo(() => items.filter(item => item.checked), [items]);
  const totalPrice = useMemo(() => items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0), [items]);
  
  // NOVO: Calcula o total apenas dos itens marcados (no carrinho)
  const checkedItemsTotalPrice = useMemo(() =>
    checkedItems.reduce((total, item) => {
      const itemPrice = item.price || 0;
      return total + itemPrice * item.quantity;
    }, 0),
    [checkedItems]
  );
  
  const checkedItemsCount = useMemo(() => checkedItems.length, [checkedItems]);

  const value = {
    items,
    addItem,
    toggleItemChecked,
    updateItemPrice,
    updateItem,
    deleteItem,
    savePurchase,
    purchaseHistory,
    uncheckedItems,
    checkedItems,
    totalPrice,
    checkedItemsTotalPrice, // Adicionado
    checkedItemsCount,
  };

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
};