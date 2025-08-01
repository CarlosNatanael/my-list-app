import React, { useState, createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Definindo as categorias para cada tipo de lista
const MERCADO_CATEGORIES = [ 'Hortifruti', 'Padaria', 'Açougue e Frios', 'Laticínios', 'Mercearia', 'Bebidas', 'Limpeza', 'Higiene', 'Outros' ];
const FARMACIA_CATEGORIES = [ 'Remédios' ];
const CONVENIENCIA_CATEGORIES = [ 'Bebidas', 'Salgadinhos', 'Doces', 'Higiene', 'Outros' ];

// Estruturas de dados
export type Item = { id: string; name: string; quantity: number; unit: 'un' | 'kg'; price?: number; checked: boolean; category: string; };
export type Purchase = { id: string; storeName: string; date: string; totalPrice: number; items: Item[]; paymentMethod: string; };
export type SavedList = { id: string; name: string; items: Omit<Item, 'id' | 'price' | 'checked'>[]; };
type ListType = 'mercado' | 'farmacia' | 'conveniencia';

type ListContextType = {
  activeListType: ListType;
  setActiveListType: (type: ListType) => void;
  activeCategories: string[];
  items: Item[];
  addItem: (item: Omit<Item, 'id' | 'checked'>) => void;
  toggleItemChecked: (id: string) => void;
  updateItemPrice: (id: string, price: number) => void;
  updateItem: (id: string, name: string, quantity: number, unit: 'un' | 'kg') => void;
  deleteItem: (id: string) => void;
  uncheckAllItems: () => void;
  clearActiveList: () => void;
  savePurchase: (storeName: string, paymentMethod: string) => Promise<void>;
  purchaseHistory: Purchase[];
  savedLists: SavedList[];
  saveListAsTemplate: (name: string) => Promise<void>;
  loadListFromTemplate: (listId: string) => void;
  deleteTemplate: (listId: string) => Promise<void>;
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

type AppLists = {
  mercado: Item[];
  farmacia: Item[];
  conveniencia: Item[];
};

export const ListProvider = ({ children }: { children: React.ReactNode }) => {
  const [lists, setLists] = useState<AppLists>({ mercado: [], farmacia: [], conveniencia: [] });
  const [activeListType, setActiveListType] = useState<ListType>('mercado');
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);

  // Carrega todos os dados do AsyncStorage ao iniciar
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem('@purchaseHistory');
        if (savedHistory) setPurchaseHistory(JSON.parse(savedHistory));

        const savedTemplates = await AsyncStorage.getItem('@savedLists');
        if (savedTemplates) setSavedLists(JSON.parse(savedTemplates));
      } catch (e) {
        console.error('Falha ao carregar dados salvos.', e);
      }
    };
    loadData();
  }, []);
  
  const activeCategories = useMemo(() => {
    switch (activeListType) {
      case 'farmacia':
        return FARMACIA_CATEGORIES;
      case 'conveniencia':
        return CONVENIENCIA_CATEGORIES;
      default:
        return MERCADO_CATEGORIES;
    }
  }, [activeListType]);
  
  const items = useMemo(() => lists[activeListType], [lists, activeListType]);

  const updateActiveList = (newItems: Item[]) => {
    setLists(prev => ({ ...prev, [activeListType]: newItems }));
  };

  const addItem = useCallback((item: Omit<Item, 'id' | 'checked'>) => {
    const newItems = [{ ...item, id: Date.now().toString(), checked: false }, ...items];
    updateActiveList(newItems);
  }, [items, activeListType]);

  const toggleItemChecked = useCallback((id: string) => {
    const newItems = items.map(item => item.id === id ? { ...item, checked: !item.checked } : item);
    updateActiveList(newItems);
  }, [items, activeListType]);

  const updateItemPrice = useCallback((id: string, price: number) => {
    const newItems = items.map(item => (item.id === id ? { ...item, price } : item));
    updateActiveList(newItems);
  }, [items, activeListType]);
  
  const updateItem = useCallback((id: string, name: string, quantity: number, unit: 'un' | 'kg') => {
    const newItems = items.map(item => item.id === id ? { ...item, name, quantity, unit } : item);
    updateActiveList(newItems);
  }, [items, activeListType]);

  const deleteItem = useCallback((id: string) => {
    const newItems = items.filter(item => item.id !== id);
    updateActiveList(newItems);
  }, [items, activeListType]);

  const uncheckAllItems = useCallback(() => {
    const newItems = items.map(item =>
        item.checked ? { ...item, checked: false } : item
      );
    updateActiveList(newItems);
  }, [items, activeListType]);

  const clearActiveList = useCallback(() => {
    Alert.alert(
      "Limpar Lista",
      "Tem certeza que deseja remover todos os itens da lista atual?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Limpar",
          onPress: () => updateActiveList([]),
          style: "destructive"
        },
      ]
    );
  }, [activeListType]);

  const savePurchase = useCallback(async (storeName: string, paymentMethod: string) => {
    const newPurchase: Purchase = {
      id: Date.now().toString(),
      storeName: storeName || 'Local não informado',
      date: new Date().toLocaleDateString('pt-BR'),
      totalPrice: items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0),
      items: [...items],
      paymentMethod: paymentMethod,
    };
    try {
      const updatedHistory = [newPurchase, ...purchaseHistory];
      setPurchaseHistory(updatedHistory);
      await AsyncStorage.setItem('@purchaseHistory', JSON.stringify(updatedHistory));
      updateActiveList([]);
    } catch (e) {
      console.error('Falha ao salvar a compra.', e);
    }
  }, [items, purchaseHistory, activeListType]);
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
      const newItems = listToLoad.items.map(item => ({ ...item, id: Date.now().toString() + Math.random(), price: undefined, checked: false }));
      updateActiveList(newItems);
    }
  }, [savedLists, activeListType]);

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
   const checkedItemsCount = useMemo(() => {

    return checkedItems.reduce((total, item) => {
      return item.unit === 'kg' ? total + 1 : total + item.quantity;
    }, 0);
  }, [checkedItems]);

  const uncheckedItemsByCategory = useMemo(() => {
    const grouped = uncheckedItems.reduce((acc, item) => {
      const { category } = item;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {} as Record<string, Item[]>);

    return activeCategories
      .map(category => ({
        title: category,
        data: grouped[category] || [],
      }))
      .filter(section => section.data.length > 0);
  }, [uncheckedItems, activeCategories]);

  const value = {
    activeListType,
    setActiveListType,
    activeCategories,
    items,
    addItem,
    toggleItemChecked,
    updateItemPrice,
    updateItem,
    deleteItem,
    uncheckAllItems,
    clearActiveList,
    savePurchase,
    purchaseHistory,
    savedLists,
    saveListAsTemplate,
    loadListFromTemplate,
    deleteTemplate,
    uncheckedItemsByCategory,
    checkedItems,
    totalPrice,
    checkedItemsTotalPrice,
    checkedItemsCount,
  };

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
};