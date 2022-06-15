import { useCallback, useEffect, useState } from 'react';

import useEffectOnce from '@/hooks/useEffectOnce';
import {
    getUrlSearchParams,
    useSetLocationParams,
} from '@/hooks/useLocationWithParams';
import { MetadataFilterWithUUID } from '@/modules/metadata/MetadataTypes';
import {
    addUUID,
    isMetadataFilter,
    removeUUID,
} from '@/modules/metadata/MetadataUtils';

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
        (value: string) => {
            const urlSearchParams = getUrlSearchParams();
            urlSearchParams.set(param, value);
            setLocationParams(urlSearchParams);
        },
        [param, setLocationParams]
    );

    const getParam = useCallback(() => {
        const urlSearchParams = getUrlSearchParams();
        return urlSearchParams.get(param);
    }, [param]);

    const deleteParam = useCallback(() => {
        const urlSearchParams = getUrlSearchParams();
        urlSearchParams.delete(param);
        setLocationParams(urlSearchParams);
    }, [param, setLocationParams]);

    const [state, setInternalState] = useState<T>(() => {
        const value = getParam();
        return value === null ? originalValue : parse(value);
    });

    const setState = useCallback(
        (value: T) => {
            const currentParamValue = getParam();
            const newParamValue = toString(value);

            if (!newParamValue && currentParamValue) {
                deleteParam();
            } else if (newParamValue && currentParamValue !== newParamValue) {
                setParam(newParamValue);
            }
        },
        [deleteParam, getParam, setParam, toString]
    );

    // set originalValue in URL if not defined at first
    useEffectOnce(() => {
        const originalParamValue = toString(originalValue);
        if (getParam() === null && originalParamValue) {
            setParam(originalParamValue);
        }
    });

    // register handler reacting to changes in URL
    useEffect(() => {
        const updateState = () => {
            const paramValue = getParam();
            setInternalState((currentValue) => {
                const newValue =
                    paramValue === null ? originalValue : parse(paramValue);
                if (toString(currentValue) === toString(newValue)) {
                    return currentValue;
                } else {
                    return newValue;
                }
            });
        };

        // register handler
        events.forEach((e) => addEventListener(e, updateState));

        return () => {
            // unregister handler
            events.forEach((e) => removeEventListener(e, updateState));
        };
    }, [getParam, originalValue, parse, toString]);

    return [state, setState];
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

const booleanParse = (v: string): boolean => v === '1';
const booleanToString = (v: boolean): string => (v ? '1' : '');
const useSyncedBooleanState = (param: string, originalValue: boolean) =>
    useSyncedState<boolean>(
        param,
        originalValue,
        booleanParse,
        booleanToString
    );

// Common boolean states
export const useFavoritesOnly = () =>
    useSyncedBooleanState('favorites_only', false);

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

// Common JSON states
// They need 2 exports:
// * one that exposes the value as actual objects for edition
// * one that exposes the value as string for inclusion in API calls
export const metadataToString = (
    metadata: MetadataFilterWithUUID[]
): string => {
    const cleanMetadata = metadata.filter(isMetadataFilter).map(removeUUID);
    if (cleanMetadata.length > 0) {
        return JSON.stringify(cleanMetadata);
    } else {
        return '';
    }
};
const parseMetadata = (v: string): MetadataFilterWithUUID[] => {
    let metadata;
    try {
        metadata = JSON.parse(v);
    } catch {
        return [];
    }
    if (!Array.isArray(metadata)) {
        return [];
    } else {
        return metadata.filter(isMetadataFilter).map(addUUID);
    }
};
export const useMetadataWithUUID = () =>
    useSyncedState<MetadataFilterWithUUID[]>(
        'metadata',
        [],
        parseMetadata,
        metadataToString
    );
export const useMetadataString = () => useSyncedStringState('metadata', '');
