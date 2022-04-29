import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';

import { useDisclosure } from '@chakra-ui/react';

import {
    getUrlSearchParams,
    useSetLocationParams,
} from '@/hooks/useSetLocationParams';
import { AssetType } from '@/modules/common/CommonTypes';

type ClearCallback = (urlSearchParams: URLSearchParams) => void;
type ApplyCallback = (urlSearchParams: URLSearchParams) => void;
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
    clearAll: () => void;
    applyAll: () => void;
    resetAll: () => void;
    isPopoverOpen: boolean;
    onPopoverOpen: (tabIndex?: number) => void;
    onPopoverClose: () => void;
    tabIndex: number;
    setTabIndex: (tabIndex: number) => void;
}

/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function */
export const TableFiltersContext = createContext<TableFiltersContext>({
    asset: 'dataset',
    register: (name, clear, apply, reset) => {},
    clearAll: () => {},
    applyAll: () => {},
    resetAll: () => {},
    isPopoverOpen: false,
    onPopoverOpen: (tabIndex?: number) => {},
    onPopoverClose: () => {},
    tabIndex: 0,
    setTabIndex: (tabIndex: number) => {},
});
/* eslint-enable @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function */

export const useTableFiltersContext = (
    asset: AssetType
): TableFiltersContext => {
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

    const setLocationParams = useSetLocationParams();

    const register: Register = (name, clear, apply, reset) => {
        tableFilters.current[name] = {
            clear,
            apply,
            reset,
        };
    };

    const clearAll = () => {
        const urlSearchParams = getUrlSearchParams();
        for (const tableFilter of Object.values(tableFilters.current)) {
            if (tableFilter.clear.current) {
                tableFilter.clear.current(urlSearchParams);
            }
        }
        setLocationParams(urlSearchParams);
    };

    const applyAll = () => {
        const urlSearchParams = getUrlSearchParams();
        for (const tableFilter of Object.values(tableFilters.current)) {
            if (tableFilter.apply.current) {
                tableFilter.apply.current(urlSearchParams);
            }
        }
        urlSearchParams.set('page', '1');
        setLocationParams(urlSearchParams);
    };

    const resetAll = () => {
        for (const tableFilter of Object.values(tableFilters.current)) {
            if (tableFilter.reset.current) {
                tableFilter.reset.current();
            }
        }
    };

    const [tabIndex, setTabIndex] = useState(0);

    const {
        isOpen: isPopoverOpen,
        onOpen,
        onClose: onPopoverClose,
    } = useDisclosure();

    const onPopoverOpen = (tabIndex?: number) => {
        if (tabIndex !== undefined) {
            setTabIndex(tabIndex);
        }
        onOpen();
    };

    return {
        asset,
        register,
        clearAll,
        applyAll,
        resetAll,
        isPopoverOpen,
        onPopoverOpen,
        onPopoverClose,
        tabIndex,
        setTabIndex,
    };
};

export const useTableFilterCallbackRefs = (filterKey: string) => {
    const clearRef = useRef<ClearCallback | null>(null);
    const applyRef = useRef<ApplyCallback | null>(null);
    const resetRef = useRef<ResetCallback | null>(null);

    const { register } = useContext(TableFiltersContext);

    useEffect(() => {
        register(filterKey, clearRef, applyRef, resetRef);
    }, []);

    return {
        clearRef,
        applyRef,
        resetRef,
    };
};
