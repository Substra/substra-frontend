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
import { setExpandedSection } from './modules/ui/UISlice';
import type { RootState, AppDispatch } from './store';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const useSearchFiltersLocation = (): [
    string,
    SearchFilterType[],
    (
        searchFiltersOrLocation: SearchFilterType[] | string,
        searchFilters?: SearchFilterType[]
    ) => void
] => {
    const [wouterLocation, setWouterLocation] = useLocation();

    const urlSearchParams = new URLSearchParams(window.location.search);
    const searchFilters = parseSearchFiltersString(
        urlSearchParams.get('search') || ''
    );

    // This function is meant to be called 3 ways:
    // 1. setSearchFiltersLocation(location)
    // 2. setSearchFiltersLocation(searchFilters)
    // 3. setSearchFiltersLocation(location, searchFilters)
    function setSearchFiltersLocation(
        searchFiltersOrLocation: SearchFilterType[] | string,
        searchFilters?: SearchFilterType[]
    ) {
        // handle the different signatures
        let newLocation = window.location.pathname;
        let newSearchFilters = [];
        if (typeof searchFiltersOrLocation === 'string') {
            newLocation = searchFiltersOrLocation;
            newSearchFilters = searchFilters || [];
        } else {
            newSearchFilters = searchFiltersOrLocation;
        }

        // build new URL
        const urlSearchParams = new URLSearchParams(window.location.search);
        urlSearchParams.set(
            'search',
            buildSearchFiltersString(newSearchFilters)
        );
        // apply new location
        setWouterLocation(`${newLocation}?${urlSearchParams.toString()}`);
    }

    return [wouterLocation, searchFilters, setSearchFiltersLocation];
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

export const useExpandedSection = (
    sectionName: string
): [boolean, (expanded: boolean) => void] => {
    const expandedSectionName = useAppSelector(
        (state) => state.ui.expandedSection
    );
    const dispatch = useAppDispatch();
    const expanded = expandedSectionName === sectionName;
    const setExpanded = (expanded: boolean) => {
        if (expanded) {
            dispatch(setExpandedSection(sectionName));
        } else {
            dispatch(setExpandedSection(''));
        }
    };
    return [expanded, setExpanded];
};
