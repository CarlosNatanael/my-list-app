import React, { useState, createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Lista de categorias e sua ordem de exibição
const CATEGORIES = [
  'Hortifruti',
  'Padaria',
  'Açougue e Frios',
  'Laticínios',
  'Mercearia',
  'Bebidas',
  'Limpeza',
  'Higiene',
  'Outros',
];

// Estruturas de dados
export type Item = { 
  id: string; 
  name: string; 
  quantity: number; 
  unit: 'un' | 'kg'; 
  price?: number; 
  checked: boolean; 
  category: string;
};
export type Purchase = { id: string; storeName: string; date: string; totalPrice: number; items: Item[]; };
export type SavedList = { id: string; name: string; items: Omit<Item, 'id' | 'price' | 'checked'>[]; };

// Tipo completo com todas as propriedades necessárias
type ListContextType = {
  items: Item[];
  addItem: (item: Omit<Item, 'id' | 'checked'>) => void;
  toggleItemChecked: (id: string) => void;
  updateItemPrice: (id: string, price: number) => void;
  updateItem: (id: string, name: string, quantity: number, unit: 'un' | 'kg') => void;
  deleteItem: (id: string) => void;
  savePurchase: (storeName: string) => Promise<void>;
  purchaseHistory: Purchase[];
  savedLists: SavedList[];
  saveListAsTemplate: (name: string) => Promise<void>;
  loadListFromTemplate: (listId: string) => void;
  deleteTemplate: (listId: string) => Promise<void>;
  uncheckedItems: Item[];
  uncheckedItemsByCategory: { title: string; data: Item[] }[];
  checkedItems: Item[];
  totalPrice: number;
  checkedItemsTotalPrice: number;
  checkedItemsCount: number;
};

const ListContext = createContext<ListContextType | undefined>(undefined);

export const useList = () => {
  const context = useContext(ListContext);
  if (!context) throw new Error('useList deve ser usado dentro de um ListProvider');
  return context;
};

export const ListProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem('@purchaseHistory');
        if (savedHistory) setPurchaseHistory(JSON.parse(savedHistory));

        const savedTemplates = await AsyncStorage.getItem('@savedLists');
        if (savedTemplates) setSavedLists(JSON.parse(savedTemplates));
      } catch (e) {
        console.error('Falha ao carregar dados.', e);
      }
    };
    loadData();
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

  const saveListAsTemplate = useCallback(async (name: string) => {
    const templateItems = items.map(({ name, quantity, unit, category }) => ({ name, quantity, unit, category }));
    const newList: SavedList = { id: Date.now().toString(), name, items: templateItems };
    try {
      const updatedLists = [newList, ...savedLists];
      setSavedLists(updatedLists);
      await AsyncStorage.setItem('@savedLists', JSON.stringify(updatedLists));
    } catch (e) {
      console.error('Falha ao salvar lista modelo.', e);
    }
  }, [items, savedLists]);

  const loadListFromTemplate = useCallback((listId: string) => {
    const listToLoad = savedLists.find(list => list.id === listId);
    if (listToLoad) {
      const newItems = listToLoad.items.map(item => ({
        ...item,
        id: Date.now().toString() + Math.random(),
        price: undefined,
        checked: false,
      }));
      setItems(newItems);
    }
  }, [savedLists]);

  const deleteTemplate = useCallback(async (listId: string) => {
    try {
      const updatedLists = savedLists.filter(list => list.id !== listId);
      setSavedLists(updatedLists);
      await AsyncStorage.setItem('@savedLists', JSON.stringify(updatedLists));
    } catch (e) {
      console.error('Falha ao deletar lista modelo.', e);
    }
  }, [savedLists]);

  const uncheckedItems = useMemo(() => items.filter(item => !item.checked), [items]);
  const checkedItems = useMemo(() => items.filter(item => item.checked), [items]);
  const totalPrice = useMemo(() => items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0), [items]);
  const checkedItemsTotalPrice = useMemo(() => checkedItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0), [checkedItems]);
  const checkedItemsCount = useMemo(() => checkedItems.length, [checkedItems]);

  const uncheckedItemsByCategory = useMemo(() => {
    const grouped = uncheckedItems.reduce((acc, item) => {
      const { category } = item;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, Item[]>);

    return CATEGORIES.map(category => ({
      title: category,
      data: grouped[category] || [],
    })).filter(section => section.data.length > 0);
  }, [uncheckedItems]);

  const value = {
    items,
    addItem,
    toggleItemChecked,
    updateItemPrice,
    updateItem,
    deleteItem,
    savePurchase,
    purchaseHistory,
    savedLists,
    saveListAsTemplate,
    loadListFromTemplate,
    deleteTemplate,
    uncheckedItems,
    uncheckedItemsByCategory,
    checkedItems,
    totalPrice,
    checkedItemsTotalPrice,
    checkedItemsCount,
  };

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
};