import { useEffect, useState } from 'react';

import { useLocation } from 'wouter';

const eventPopstate = 'popstate';
const eventPushState = 'pushState';
const eventReplaceState = 'replaceState';
export const events = [eventPopstate, eventPushState, eventReplaceState];

export const useSyncedState = <T>(
    param: string,
    originalValue: T,
    parse: (value: string) => T,
    toString: (value: T) => string
): [T, (value: T) => void] => {
    const [, setLocation] = useLocation();

    const setLocationParams = (urlSearchParams: URLSearchParams) => {
        setLocation(
            `${window.location.pathname}?${urlSearchParams.toString()}`,
            { replace: true }
        );
    };

    const setParam = (value: T) => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        urlSearchParams.set(param, toString(value));
        setLocationParams(urlSearchParams);
    };

    const getParam = () => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        return urlSearchParams.get(param);
    };

    const deleteParam = () => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        urlSearchParams.delete(param);
        setLocationParams(urlSearchParams);
    };

    const [state, setState] = useState<T>(() => {
        const value = getParam();
        return value === null ? originalValue : parse(value);
    });

    useEffect(() => {
        const updateState = () => {
            const value = getParam();
            if (value === null) {
                setParam(originalValue);
            } else {
                setState(parse(value));
            }
        };

        events.forEach((e) => addEventListener(e, updateState));

        return () => {
            // unregister events
            events.forEach((e) => removeEventListener(e, updateState));
            // reset param in URL
            deleteParam();
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

export const useSyncedNumberState = (param: string, originalValue: number) =>
    useSyncedState<number>(
        param,
        originalValue,
        (v) => parseInt(v),
        (v) => v.toFixed(0)
    );
