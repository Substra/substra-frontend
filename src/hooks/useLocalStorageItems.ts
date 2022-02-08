import { useState } from 'react';

import { useCustomCompareEffect } from 'use-custom-compare';

import { HasKey } from '@/modules/common/CommonTypes';

function useLoadSave<T>(localStorageKey: string) {
    const load = (): T[] => {
        const jsonItems = localStorage.getItem(localStorageKey) || '[]';
        try {
            return JSON.parse(jsonItems);
        } catch {
            // do nothing
        }
        return [];
    };

    const save = (items: T[]): void => {
        localStorage.setItem(localStorageKey, JSON.stringify(items));
    };

    return { load, save };
}

const customCompare = (
    prevDeps: React.DependencyList,
    nextDeps: React.DependencyList
): boolean => {
    const prevItems: HasKey[] = prevDeps[0] || [];
    const nextItems: HasKey[] = nextDeps[0] || [];

    if (prevItems.length !== nextItems.length) {
        return false;
    }

    return prevItems.reduce(
        (areEqual: boolean, prevItem: HasKey, index: number): boolean => {
            return areEqual && prevItem.key === nextItems[index].key;
        },
        true
    );
};

function useLocalStorageItems<Type extends HasKey>(
    localStorageKey: string
): {
    items: Type[];
    addItem: (item: Type) => void;
    removeItem: (item: Type) => void;
    clearItems: () => void;
} {
    const { load, save } = useLoadSave<Type>(localStorageKey);
    const [items, setItems] = useState(load);

    useCustomCompareEffect(
        () => {
            save(items);
        },
        [items],
        customCompare
    );

    const addItem = (item: Type) => {
        setItems([...items, item]);
    };

    const removeItem = (item: Type) => {
        setItems(items.filter((i) => i.key !== item.key));
    };

    const clearItems = () => {
        setItems([]);
    };

    return {
        items,
        addItem,
        removeItem,
        clearItems,
    };
}
export default useLocalStorageItems;
