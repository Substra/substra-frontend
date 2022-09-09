import { useCallback, useEffect, useState } from 'react';

import useAppSelector from '@/hooks/useAppSelector';
import { HasKeyT } from '@/modules/common/CommonTypes';

function useLoadSave<T>(
    localStorageKey: string,
    channel: string | undefined,
    migrate?: (data: unknown) => T
) {
    const channelLocalStorageKey = `${channel}-${localStorageKey}`;

    const load = useCallback((): T | null => {
        if (!channel) {
            return null;
        }
        const jsonItems = localStorage.getItem(channelLocalStorageKey) || null;
        try {
            let items;
            if (jsonItems) {
                items = JSON.parse(jsonItems);
            }
            if (migrate && items) {
                return migrate(items);
            } else {
                return items;
            }
        } catch {
            // do nothing
        }
        return null;
    }, [channelLocalStorageKey, channel, migrate]);

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
    originalValue: Type,
    migrate?: (data: unknown) => Type
): [Type, (value: Type) => void] => {
    const channel = useAppSelector((state) => state.me.info.channel);
    const { load, save } = useLoadSave<Type>(localStorageKey, channel, migrate);
    const [state, setLocalState] = useState(() => load() ?? originalValue);

    useEffect(() => {
        setLocalState(load() ?? originalValue);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [channel]);

    const setState = useCallback(
        (state: Type) => {
            save(state);
            setLocalState(state);
        },
        [save]
    );

    return [state, setState];
};

export const useLocalStorageArrayState = <Type>(
    localStorageKey: string,
    areEqual: (a: Type, b: Type) => boolean,
    migrate?: (data: unknown) => Type[],
    originalValue?: Type[]
) => {
    const [state, setState] = useLocalStorageState<Type[]>(
        localStorageKey,
        originalValue ?? [],
        migrate
    );
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

const areKeyItemsEqual = <Type extends HasKeyT>(a: Type, b: Type) =>
    a.key === b.key;
export const useLocalStorageKeyArrayState = <Type extends HasKeyT>(
    localStorageKey: string
) => useLocalStorageArrayState<Type>(localStorageKey, areKeyItemsEqual);

const areStringItemsEqual = (a: string, b: string) => a === b;
export const useLocalStorageStringArrayState = (localStorageKey: string) =>
    useLocalStorageArrayState<string>(localStorageKey, areStringItemsEqual);
