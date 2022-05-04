import { useEffect, useState } from 'react';

import {
    getUrlSearchParams,
    useSetLocationParams,
} from '@/hooks/useSetLocationParams';

const eventPopstate = 'popstate';
const eventPushState = 'pushState';
const eventReplaceState = 'replaceState';
const events = [eventPopstate, eventPushState, eventReplaceState];

export const useSyncedState = <T>(
    param: string,
    originalValue: T,
    parse: (value: string) => T,
    toString: (value: T) => string
): [T, (value: T) => void] => {
    const setLocationParams = useSetLocationParams();

    const setParam = (value: T) => {
        const urlSearchParams = getUrlSearchParams();
        urlSearchParams.set(param, toString(value));
        setLocationParams(urlSearchParams);
    };

    const getParam = () => {
        const urlSearchParams = getUrlSearchParams();
        return urlSearchParams.get(param);
    };

    const [state, setState] = useState<T>(() => {
        const value = getParam();
        return value === null ? originalValue : parse(value);
    });

    useEffect(() => {
        // set originalValue in URL if not defined at first
        if (getParam() === null) {
            setParam(originalValue);
        }

        // handler reacting to changes in URL
        const updateState = () => {
            const value = getParam();
            setState(value === null ? originalValue : parse(value));
        };

        // register handler
        events.forEach((e) => addEventListener(e, updateState));

        return () => {
            // unregister handler
            events.forEach((e) => removeEventListener(e, updateState));
        };
    }, []);

    return [state, setParam];
};

export const useSyncedStringState = (param: string, originalValue: string) =>
    useSyncedState<string>(
        param,
        originalValue,
        (v) => v,
        (v) => v
    );

export const useSyncedStringArrayState = (
    param: string,
    originalValue: string[]
) =>
    useSyncedState<string[]>(
        param,
        originalValue,
        (valueAsString) => valueAsString.split(',').filter((v) => !!v),
        (v) => v.join(',')
    );

export const useSyncedDateStringState = (
    param: string,
    originalValue: string
) =>
    useSyncedState<string>(
        param,
        originalValue,
        (v) => {
            const timestamp = Date.parse(v);
            if (isNaN(timestamp)) {
                return '';
            } else {
                const d = new Date(timestamp);
                const month = `${d.getMonth() + 1}`.padStart(2, '0');
                const day = `${d.getDate()}`.padStart(2, '0');
                const res = `${d.getFullYear()}-${month}-${day}`;
                return res;
            }
        },
        (v) => v
    );

export const useSyncedNumberState = (param: string, originalValue: number) =>
    useSyncedState<number>(
        param,
        originalValue,
        (v) => parseInt(v),
        (v) => v.toFixed(0)
    );

// Common string states
export const useOrdering = (defaultValue: string) =>
    useSyncedStringState('ordering', defaultValue);

// Common string arrays states
export const useCategory = () => useSyncedStringArrayState('category', []);
export const useKey = () => useSyncedStringArrayState('key', []);
export const useOwner = () => useSyncedStringArrayState('owner', []);
export const useStatus = () => useSyncedStringArrayState('status', []);
export const useWorker = () => useSyncedStringArrayState('worker', []);

// Common dates states
export const useCreationDate = () => {
    const [creationDateAfter, setCreationDateAfter] = useSyncedDateStringState(
        'creation_date_after',
        ''
    );
    const [creationDateBefore, setCreationDateBefore] =
        useSyncedDateStringState('creation_date_before', '');
    return {
        creationDateAfter,
        setCreationDateAfter,
        creationDateBefore,
        setCreationDateBefore,
    };
};
export const useStartDate = () => {
    const [startDateAfter, setStartDateAfter] = useSyncedDateStringState(
        'start_date_after',
        ''
    );
    const [startDateBefore, setStartDateBefore] = useSyncedDateStringState(
        'start_date_before',
        ''
    );
    return {
        startDateAfter,
        setStartDateAfter,
        startDateBefore,
        setStartDateBefore,
    };
};
export const useEndDate = () => {
    const [endDateAfter, setEndDateAfter] = useSyncedDateStringState(
        'end_date_after',
        ''
    );
    const [endDateBefore, setEndDateBefore] = useSyncedDateStringState(
        'end_date_before',
        ''
    );
    return {
        endDateAfter,
        setEndDateAfter,
        endDateBefore,
        setEndDateBefore,
    };
};
