import { createContext, useContext, useEffect, useRef } from 'react';

import { AssetType } from '@/modules/common/CommonTypes';

import {
    areSearchFiltersListsEqual,
    SearchFilterType,
} from '@/libs/searchFilter';

import useLocationWithParams from '@/hooks/useLocationWithParams';
import useSelection, { OnOptionChange } from '@/hooks/useSelection';

type ClearCallback = (searchFilters: SearchFilterType[]) => SearchFilterType[];
type ApplyCallback = (searchFilters: SearchFilterType[]) => SearchFilterType[];
type ResetCallback = () => void;

type Register = (
    name: string,
    clear: React.RefObject<ClearCallback>,
    apply: React.RefObject<ApplyCallback>,
    reset: React.RefObject<ResetCallback>
) => void;

interface TableFiltersContext {
    asset: AssetType;
    register: Register;
}

export const TableFiltersContext = createContext<TableFiltersContext>({
    asset: 'dataset',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
    register: (name, clear, apply, reset) => {},
});

export const useTableFilters = (
    asset: AssetType
): {
    context: TableFiltersContext;
    clearAll: () => void;
    applyAll: () => void;
    resetAll: () => void;
} => {
    const tableFilters = useRef<
        Record<
            string,
            {
                clear: React.RefObject<ClearCallback>;
                apply: React.RefObject<ApplyCallback>;
                reset: React.RefObject<ResetCallback>;
            }
        >
    >({});
    const {
        params: { search: searchFilters },
        setLocationWithParams,
    } = useLocationWithParams();

    const register: Register = (name, clear, apply, reset) => {
        tableFilters.current[name] = {
            clear,
            apply,
            reset,
        };
    };

    const setSearchFilters = (newFilters: SearchFilterType[]) => {
        if (!areSearchFiltersListsEqual(searchFilters, newFilters)) {
            setLocationWithParams({ search: newFilters, page: 1 });
        }
    };
    const clearAll = () => {
        let newSearchFilters = [...searchFilters];
        for (const tableFilter of Object.values(tableFilters.current)) {
            if (tableFilter.clear.current) {
                newSearchFilters = tableFilter.clear.current(newSearchFilters);
            }
        }
        setSearchFilters(newSearchFilters);
    };

    const applyAll = () => {
        let newSearchFilters = [...searchFilters];
        for (const tableFilter of Object.values(tableFilters.current)) {
            if (tableFilter.apply.current) {
                newSearchFilters = tableFilter.apply.current(newSearchFilters);
            }
        }
        setSearchFilters(newSearchFilters);
    };

    const resetAll = () => {
        for (const tableFilter of Object.values(tableFilters.current)) {
            if (tableFilter.reset.current) {
                tableFilter.reset.current();
            }
        }
    };

    const context: TableFiltersContext = {
        asset,
        register,
    };

    return {
        context,
        clearAll,
        applyAll,
        resetAll,
    };
};

export const useTableFilter = (
    filterKey: string
): { checkboxesValue: string[]; onOptionChange: OnOptionChange } => {
    const clearRef = useRef<ClearCallback | null>(null);
    const applyRef = useRef<ApplyCallback | null>(null);
    const resetRef = useRef<ResetCallback | null>(null);

    const { asset, register } = useContext(TableFiltersContext);

    useEffect(() => {
        register(filterKey, clearRef, applyRef, resetRef);
    }, []);

    const {
        params: { search: searchFilters },
    } = useLocationWithParams();

    const value = searchFilters
        .filter((filter) => filter.asset === asset && filter.key === filterKey)
        .map((filter) => filter.value);

    const [
        checkboxesValue,
        onOptionChange,
        resetCheckboxesValue,
        setCheckboxesValue,
    ] = useSelection(value);

    const setValue = (
        searchFilters: SearchFilterType[],
        newValue: string[]
    ): SearchFilterType[] => {
        const assetKeyFilters = newValue.map((v) => ({
            asset,
            key: filterKey,
            value: v,
        }));
        const otherFilters = searchFilters.filter(
            (sf) => filterKey !== sf.key || asset !== sf.asset
        );
        return [...assetKeyFilters, ...otherFilters];
    };
    clearRef.current = (searchFilters) => {
        resetCheckboxesValue();
        return setValue(searchFilters, []);
    };
    applyRef.current = (searchFilters) => {
        return setValue(searchFilters, checkboxesValue);
    };
    resetRef.current = () => {
        setCheckboxesValue(value);
    };

    return {
        checkboxesValue,
        onOptionChange,
    };
};
