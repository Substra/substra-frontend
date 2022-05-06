import { useCallback, useEffect, useState } from 'react';

import {
    getUrlSearchParams,
    useSetLocationParams,
} from '@/hooks/useLocationWithParams';

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

    const setParam = useCallback(
        (value: T) => {
            const urlSearchParams = getUrlSearchParams();
            urlSearchParams.set(param, toString(value));
            setLocationParams(urlSearchParams);
        },
        [param, setLocationParams, toString]
    );

    const getParam = useCallback(() => {
        const urlSearchParams = getUrlSearchParams();
        return urlSearchParams.get(param);
    }, [param]);

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
    }, [getParam, originalValue, parse, setParam]);

    return [state, setParam];
};

const stringIdentity = (v: string): string => v;

export const useSyncedStringState = (param: string, originalValue: string) =>
    useSyncedState<string>(
        param,
        originalValue,
        stringIdentity,
        stringIdentity
    );

const stringArrayParse = (valueAsString: string): string[] =>
    valueAsString.split(',').filter((v) => !!v);
const stringArrayToString = (v: string[]): string => v.join(',');
export const useSyncedStringArrayState = (
    param: string,
    originalValue: string[]
) =>
    useSyncedState<string[]>(
        param,
        originalValue,
        stringArrayParse,
        stringArrayToString
    );

const dateStringParse = (v: string): string => {
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
};
export const useSyncedDateStringState = (
    param: string,
    originalValue: string
) =>
    useSyncedState<string>(
        param,
        originalValue,
        dateStringParse,
        stringIdentity
    );

const numberParse = (v: string): number => parseInt(v);
const numberToString = (v: number): string => v.toFixed(0);
export const useSyncedNumberState = (param: string, originalValue: number) =>
    useSyncedState<number>(param, originalValue, numberParse, numberToString);

// Common number states
export const usePage = () => useSyncedNumberState('page', 1);

// Common string states
export const useMatch = () => useSyncedStringState('match', '');
export const useOrdering = (defaultValue: string) =>
    useSyncedStringState('ordering', defaultValue);

// Common string arrays states
export const useCanAccessLogs = () =>
    useSyncedStringArrayState('can_access_logs', []);
export const useCanProcess = () => useSyncedStringArrayState('can_process', []);
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
