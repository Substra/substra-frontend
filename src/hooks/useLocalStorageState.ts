import { useCallback, useState } from 'react';

import useAppSelector from '@/hooks/useAppSelector';
import useEffectOnce from '@/hooks/useEffectOnce';
import { HasKey } from '@/modules/common/CommonTypes';

function useLoadSave<T>(localStorageKey: string, channel: string | undefined) {
    const channelLocalStorageKey = `${channel}-${localStorageKey}`;

    const load = useCallback((): T | null => {
        if (!channel) {
            return null;
        }
        const jsonItems = localStorage.getItem(channelLocalStorageKey) || null;
        try {
            if (jsonItems) {
                return JSON.parse(jsonItems);
            }
        } catch {
            // do nothing
        }
        return null;
    }, [channelLocalStorageKey, channel]);

    const save = useCallback(
        (items: T | null): void => {
            if (!channel) {
                return;
            }
            localStorage.setItem(channelLocalStorageKey, JSON.stringify(items));
        },
        [channel, channelLocalStorageKey]
    );

    return { load, save };
}

export const useLocalStorageState = <Type>(
    localStorageKey: string,
    originalValue: Type
): [Type, (value: Type) => void] => {
    const channel = useAppSelector((state) => state.nodes.info.channel);
    const { load, save } = useLoadSave<Type>(localStorageKey, channel);
    const [state, setLocalState] = useState(() => load() ?? originalValue);

    useEffectOnce(() => {
        setLocalState(load() ?? originalValue);
    });

    const setState = useCallback(
        (state: Type) => {
            save(state);
            setLocalState(state);
        },
        [save]
    );

    return [state, setState];
};

const useLocalStorageArrayState = <Type>(
    localStorageKey: string,
    areEqual: (a: Type, b: Type) => boolean
) => {
    const [state, setState] = useLocalStorageState<Type[]>(localStorageKey, []);

    const clearState = () => setState([]);

    const includesItem = (item: Type) => {
        for (const i of state) {
            if (areEqual(i, item)) {
                return true;
            }
        }
        return false;
    };

    const addItem = (item: Type) => {
        const newState = [...state, item];
        setState(newState);
    };

    const removeItem = (item: Type) => {
        const newState = state.filter((i) => !areEqual(i, item));
        setState(newState);
    };

    return {
        state: state,
        setState,
        clearState,
        includesItem,
        addItem,
        removeItem,
    };
};

const areKeyItemsEqual = <Type extends HasKey>(a: Type, b: Type) =>
    a.key === b.key;
export const useLocalStorageKeyArrayState = <Type extends HasKey>(
    localStorageKey: string
) => useLocalStorageArrayState<Type>(localStorageKey, areKeyItemsEqual);

const areStringItemsEqual = (a: string, b: string) => a === b;
export const useLocalStorageStringArrayState = (localStorageKey: string) =>
    useLocalStorageArrayState<string>(localStorageKey, areStringItemsEqual);
