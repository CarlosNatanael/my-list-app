import React, { useState, createContext, useContext, useMemo, useCallback, useEffect } from 'react';
import { Alert, Clipboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const INITIAL_MERCADO_CATEGORIES = [ 'Hortifruti', 'Padaria', 'Açougue e Frios', 'Laticínios', 'Mercearia', 'Bebidas', 'Limpeza', 'Higiene', 'Outros' ];
const INITIAL_FARMACIA_CATEGORIES = [ 'Remédios' ];
const INITIAL_CONVENIENCIA_CATEGORIES = [ 'Bebidas', 'Salgadinhos', 'Doces', 'Higiene', 'Outros' ];

export type Item = { id: string; name: string; quantity: number; unit: 'un' | 'kg'; price?: number; checked: boolean; category: string; };
export type Purchase = { id: string; storeName: string; date: string; totalPrice: number; items: Item[]; paymentMethod: string; };
export type SavedList = { id: string; name: string; items: Omit<Item, 'id' | 'price' | 'checked'>[]; };
type ListType = 'mercado' | 'farmacia' | 'conveniencia';
type AppLists = { mercado: Item[]; farmacia: Item[]; conveniencia: Item[]; };
type AppCategories = { mercado: string[]; farmacia: string[]; conveniencia: string[]; };

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
  clearActiveList: () => void;
  uncheckAllItems: () => void;
  savePurchase: (storeName: string, paymentMethod: string) => Promise<void>;
  purchaseHistory: Purchase[];
  savedLists: SavedList[];
  saveListAsTemplate: (name: string) => Promise<void>;
  loadListFromTemplate: (listId: string) => void;
  deleteTemplate: (listId: string) => Promise<void>;
  updateTemplate: (listId: string, newName: string, newItems: Omit<Item, 'id' | 'price' | 'checked'>[]) => Promise<void>;
  uncheckedItemsByCategory: { title: string; data: Item[] }[];
  checkedItems: Item[];
  totalPrice: number;
  checkedItemsTotalPrice: number;
  checkedItemsCount: number;
  updateCategories: (newCategories: string[]) => Promise<void>;
  importList: (jsonString: string) => void;
};

const ListContext = createContext<ListContextType | undefined>(undefined);

export const useList = () => {
  const context = useContext(ListContext);
  if (!context) throw new Error('useList deve ser usado dentro de um ListProvider');
  return context;
};

export const ListProvider = ({ children }: { children: React.ReactNode }) => {
  const [lists, setLists] = useState<AppLists>({ mercado: [], farmacia: [], conveniencia: [] });
  const [activeListType, setActiveListType] = useState<ListType>('mercado');
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [categories, setCategories] = useState<AppCategories>({
    mercado: INITIAL_MERCADO_CATEGORIES,
    farmacia: INITIAL_FARMACIA_CATEGORIES,
    conveniencia: INITIAL_CONVENIENCIA_CATEGORIES,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedHistory = await AsyncStorage.getItem('@purchaseHistory');
        if (savedHistory) setPurchaseHistory(JSON.parse(savedHistory));
        
        const savedTemplates = await AsyncStorage.getItem('@savedLists');
        if (savedTemplates) setSavedLists(JSON.parse(savedTemplates));

        const savedCategories = await AsyncStorage.getItem('@appCategories');
        if (savedCategories) setCategories(JSON.parse(savedCategories));

        const savedActiveLists = await AsyncStorage.getItem('@appLists');
        if (savedActiveLists) setLists(JSON.parse(savedActiveLists));
      } catch (e) {
        console.error('Falha ao carregar dados.', e);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const saveLists = async () => {
      try {
        await AsyncStorage.setItem('@appLists', JSON.stringify(lists));
      } catch (e) {
        console.error('Falha ao salvar listas ativas.', e);
      }
    };
    saveLists();
  }, [lists]);

  const importList = useCallback((jsonString: string) => {
    try {
      const importedItems: Item[] = JSON.parse(jsonString);
      if (Array.isArray(importedItems) && importedItems.length > 0) {
        const validatedItems = importedItems.map(item => ({
          ...item,
          id: Date.now().toString() + Math.random(),
          checked: false
        }));
        updateActiveList(validatedItems);
        Alert.alert("Sucesso", "Lista importada com sucesso!");
      }
    } catch (e) {
      Alert.alert("Erro", "O código da lista é inválido.");
    }
  }, [activeListType]);
  
  const activeCategories = useMemo(() => categories[activeListType], [categories, activeListType]);
  const items = useMemo(() => lists[activeListType], [lists, activeListType]);
  const updateActiveList = (newItems: Item[]) => setLists(prev => ({ ...prev, [activeListType]: newItems }));
  const addItem = useCallback((item: Omit<Item, 'id' | 'checked'>) => updateActiveList([{ ...item, id: Date.now().toString(), checked: false }, ...items]), [items, activeListType]);
  const toggleItemChecked = useCallback((id: string) => updateActiveList(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item)), [items, activeListType]);
  const updateItemPrice = useCallback((id: string, price: number) => updateActiveList(items.map(item => (item.id === id ? { ...item, price } : item))), [items, activeListType]);
  const updateItem = useCallback((id: string, name: string, quantity: number, unit: 'un' | 'kg') => updateActiveList(items.map(item => item.id === id ? { ...item, name, quantity, unit } : item)), [items, activeListType]);
  const deleteItem = useCallback((id: string) => updateActiveList(items.filter(item => item.id !== id)), [items, activeListType]);
  const clearActiveList = useCallback(() => Alert.alert("Limpar Lista", "Tem certeza?", [ { text: "Cancelar" }, { text: "Limpar", onPress: () => updateActiveList([]) } ]), [activeListType]);
  const updateCategories = useCallback(async (newCategories: string[]) => {
    const updatedCategories = { ...categories, [activeListType]: newCategories };
    setCategories(updatedCategories);
    await AsyncStorage.setItem('@appCategories', JSON.stringify(updatedCategories));
  }, [categories, activeListType]);
  
  // Função para desmarcar todos os itens
  const uncheckAllItems = useCallback(() => {
    updateActiveList(items.map(item => ({ ...item, checked: false })));
  }, [items, activeListType]);

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
    } catch (e) { console.error('Falha ao salvar a compra.', e); }
  }, [items, purchaseHistory, activeListType]);
  
  const saveListAsTemplate = useCallback(async (name: string) => {
    const templateItems = items.map(({ name, quantity, unit, category }) => ({ name, quantity, unit, category }));
    const newList: SavedList = { id: Date.now().toString(), name, items: templateItems };
    try {
      const updatedLists = [newList, ...savedLists];
      setSavedLists(updatedLists);
      await AsyncStorage.setItem('@savedLists', JSON.stringify(updatedLists));
    } catch (e) { console.error('Falha ao salvar lista modelo.', e); }
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
    } catch (e) { console.error('Falha ao deletar lista modelo.', e); }
  }, [savedLists]);

  const updateTemplate = useCallback(async (listId: string, newName: string, newItems: Omit<Item, 'id' | 'price' | 'checked'>[]) => {
    try {
      const updatedLists = savedLists.map(list => 
        list.id === listId ? { ...list, name: newName, items: newItems } : list
      );
      setSavedLists(updatedLists);
      await AsyncStorage.setItem('@savedLists', JSON.stringify(updatedLists));
    } catch (e) {
      console.error('Falha ao atualizar o modelo.', e);
    }
  }, [savedLists]);

  const uncheckedItems = useMemo(() => items.filter(item => !item.checked), [items]);
  const checkedItems = useMemo(() => items.filter(item => item.checked), [items]);
  const totalPrice = useMemo(() => items.reduce((total, item) => total + (item.price || 0) * item.quantity, 0), [items]);
  const checkedItemsTotalPrice = useMemo(() => checkedItems.reduce((total, item) => total + (item.price || 0) * item.quantity, 0), [checkedItems]);
  const checkedItemsCount = useMemo(() => checkedItems.reduce((total, item) => (item.unit === 'kg' ? total + 1 : total + item.quantity), 0), [checkedItems]);
  const uncheckedItemsByCategory = useMemo(() => {
    const grouped = uncheckedItems.reduce((acc, item) => {
      const { category } = item;
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {} as Record<string, Item[]>);
    return activeCategories.map((category: string) => ({ title: category, data: grouped[category] || [] })).filter((section: { data: string | any[]; }) => section.data.length > 0);
  }, [uncheckedItems, activeCategories]);

  const value = {
    activeListType, setActiveListType, activeCategories, items, addItem,
    toggleItemChecked, updateItemPrice, updateItem, deleteItem, clearActiveList,
    savePurchase, purchaseHistory, savedLists, saveListAsTemplate, loadListFromTemplate,
    uncheckedItemsByCategory, checkedItems, totalPrice,
    checkedItemsTotalPrice, checkedItemsCount, updateCategories, deleteTemplate, updateTemplate,
    uncheckAllItems,importList
  };

  return <ListContext.Provider value={value as ListContextType}>{children}</ListContext.Provider>;
};