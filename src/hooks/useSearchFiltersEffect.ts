import { useCustomCompareEffect } from 'use-custom-compare';
import {
    areSearchFiltersListsEqual,
    isSearchFiltersList,
} from '@/libs/searchFilter';

const customCompare = (
    prevDeps: React.DependencyList,
    nextDeps: React.DependencyList
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
    effect: React.EffectCallback,
    deps: React.DependencyList
): void => {
    useCustomCompareEffect(effect, deps, customCompare);
};

export default useSearchFiltersEffect;
