import { useEffect, useState } from 'react';

import { HasKey } from '@/modules/common/CommonTypes';

import useAppSelector from './useAppSelector';

function useLoadSave<T>(localStorageKey: string, channel?: string) {
    if (!channel) {
        return {
            load: () => [],
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            save: () => {},
        };
    }
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

function useLocalStorageItems<Type>(
    localStorageKey: string,
    areEqual: (a: Type, b: Type) => boolean
): {
    items: Type[];
    setItems: (items: Type[]) => void;
    includesItem: (item: Type) => boolean;
    addItem: (item: Type) => void;
    updateItem: (item: Type) => void;
    removeItem: (item: Type) => void;
    clearItems: () => void;
} {
    const channel = useAppSelector((state) => state.nodes.info.channel);
    const { load, save } = useLoadSave<Type>(localStorageKey, channel);
    const [items, setStateItems] = useState(load);

    useEffect(() => {
        if (channel) {
            setStateItems(load());
        }
    }, [channel]);

    const includesItem = (item: Type) => {
        for (const i of items) {
            if (areEqual(i, item)) {
                return true;
            }
        }
        return false;
    };

    const setItems = (items: Type[]) => {
        save(items);
        setStateItems(items);
    };

    const addItem = (item: Type) => {
        const newItems = [...items, item];
        setItems(newItems);
    };

    const removeItem = (item: Type) => {
        const newItems = items.filter((i) => !areEqual(i, item));
        setItems(newItems);
    };

    const updateItem = (item: Type) => {
        const newItems = items.map((currentItem) =>
            areEqual(currentItem, item) ? item : currentItem
        );
        setItems(newItems);
    };

    const clearItems = () => {
        setItems([]);
    };

    return {
        items,
        setItems,
        includesItem,
        addItem,
        updateItem,
        removeItem,
        clearItems,
    };
}

export function useLocalStorageKeyItems<Type extends HasKey>(
    localStorageKey: string
) {
    return useLocalStorageItems<Type>(
        localStorageKey,
        (a: Type, b: Type) => a.key === b.key
    );
}

export function useLocalStorageStringItems(localStorageKey: string) {
    return useLocalStorageItems<string>(
        localStorageKey,
        (a: string, b: string) => a === b
    );
}

export default useLocalStorageKeyItems;
