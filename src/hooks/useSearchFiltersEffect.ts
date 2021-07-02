import { DependencyList, EffectCallback } from 'react';
import { useCustomCompareEffect } from 'use-custom-compare';
import {
    areSearchFiltersListsEqual,
    isSearchFiltersList,
} from '@/libs/searchFilter';

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

const useSearchFiltersEffect = (
    effect: EffectCallback,
    deps: DependencyList
): void => {
    useCustomCompareEffect(effect, deps, customCompare);
};

export default useSearchFiltersEffect;
