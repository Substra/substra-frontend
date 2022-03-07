import { useState } from 'react';

import useAppSelector from './useAppSelector';

import { HasKey } from '@/modules/common/CommonTypes';

function useLoadSave<T>(localStorageKey: string) {
    const channel = useAppSelector((state) => state.nodes.info.channel);
    const channelLocalStorageKey = `${channel}-${localStorageKey}`;
    const load = (): T[] => {
        const jsonItems = localStorage.getItem(channelLocalStorageKey) || '[]';
        try {
            return JSON.parse(jsonItems);
        } catch {
            // do nothing
        }
        return [];
    };

    const save = (items: T[]): void => {
        localStorage.setItem(channelLocalStorageKey, JSON.stringify(items));
    };

    return { load, save };
}

function useLocalStorageItems<Type extends HasKey>(
    localStorageKey: string
): {
    items: Type[];
    addItem: (item: Type) => void;
    updateItem: (item: Type) => void;
    removeItem: (item: Type) => void;
    clearItems: () => void;
} {
    const { load, save } = useLoadSave<Type>(localStorageKey);
    const [items, setItems] = useState(load);

    const addItem = (item: Type) => {
        const newItems = [...items, item];
        save(newItems);
        setItems(newItems);
    };

    const removeItem = (item: Type) => {
        const newItems = items.filter((i) => i.key !== item.key);
        save(newItems);
        setItems(newItems);
    };

    const updateItem = (item: Type) => {
        const newItems = items.map((currentItem) =>
            currentItem.key === item.key ? item : currentItem
        );
        save(newItems);
        setItems(newItems);
    };

    const clearItems = () => {
        save([]);
        setItems([]);
    };

    return {
        items,
        addItem,
        updateItem,
        removeItem,
        clearItems,
    };
}
export default useLocalStorageItems;
