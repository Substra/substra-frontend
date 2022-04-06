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
    includesItem: (item: Type) => boolean;
    addItem: (item: Type) => void;
    updateItem: (item: Type) => void;
    removeItem: (item: Type) => void;
    replaceItems: (item: Type[]) => void;
    clearItems: () => void;
} {
    const channel = useAppSelector((state) => state.nodes.info.channel);
    const { load, save } = useLoadSave<Type>(localStorageKey, channel);
    const [items, setItems] = useState(load);

    useEffect(() => {
        if (channel) {
            setItems(load());
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

    const addItem = (item: Type) => {
        const newItems = [...items, item];
        save(newItems);
        setItems(newItems);
    };

    const removeItem = (item: Type) => {
        const newItems = items.filter((i) => !areEqual(i, item));
        save(newItems);
        setItems(newItems);
    };

    const updateItem = (item: Type) => {
        const newItems = items.map((currentItem) =>
            areEqual(currentItem, item) ? item : currentItem
        );
        save(newItems);
        setItems(newItems);
    };

    const replaceItems = (items: Type[]) => {
        save(items);
        setItems(items);
    };

    const clearItems = () => {
        save([]);
        setItems([]);
    };

    return {
        items,
        includesItem,
        addItem,
        updateItem,
        removeItem,
        replaceItems,
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
