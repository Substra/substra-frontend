import { DependencyList, EffectCallback } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { useCustomCompareEffect } from 'react-use';
import { useLocation } from 'wouter';
import {
    SearchFilterType,
    parseSearchFiltersString,
    buildSearchFiltersString,
    areSearchFiltersListsEqual,
    isSearchFiltersList,
} from './libs/searchFilter';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useSearchFilters = (): [
    SearchFilterType[],
    (filters: SearchFilterType[]) => void
] => {
    const [, setLocation] = useLocation();

    const urlSearchParams = new URLSearchParams(window.location.search);
    const filters = parseSearchFiltersString(
        urlSearchParams.get('search') || ''
    );

    const setSearchFilters = (filters: SearchFilterType[]) => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        urlSearchParams.set('search', buildSearchFiltersString(filters));
        setLocation(
            `${window.location.pathname}?${urlSearchParams.toString()}`
        );
    };

    return [filters, setSearchFilters];
};

export const useSearchFiltersEffect = (
    effect: EffectCallback,
    deps: DependencyList
): void => {
    const customCompare = (
        prevDeps: DependencyList,
        nextDeps: DependencyList
    ): boolean => {
        return prevDeps.every((prevDep, index) => {
            const nextDep = nextDeps[index];
            if (isSearchFiltersList(prevDep) && isSearchFiltersList(nextDep)) {
                return areSearchFiltersListsEqual(prevDep, nextDep);
            }
            return nextDep === prevDep;
        });
    };

    useCustomCompareEffect(effect, deps, customCompare);
};
