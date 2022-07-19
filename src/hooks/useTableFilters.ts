import React, {
    createContext,
    useCallback,
    useContext,
    useRef,
    useState,
} from 'react';

import { useDisclosure } from '@chakra-ui/react';

import useEffectOnce from '@/hooks/useEffectOnce';
import {
    getUrlSearchParams,
    useSetLocationParams,
} from '@/hooks/useLocationWithParams';
import { AssetT } from '@/modules/common/CommonTypes';

type ClearCallbackT = (urlSearchParams: URLSearchParams) => void;
type ApplyCallbackT = (urlSearchParams: URLSearchParams) => void;
type ResetCallbackT = () => void;

type RegisterT = (
    name: string,
    clear: React.RefObject<ClearCallbackT>,
    apply: React.RefObject<ApplyCallbackT>,
    reset: React.RefObject<ResetCallbackT>
) => void;

type TableFiltersContextT = {
    asset: AssetT;
    register: RegisterT;
    clearAll: () => void;
    applyAll: () => void;
    resetAll: () => void;
    isPopoverOpen: boolean;
    onPopoverOpen: (tabIndex?: number) => void;
    onPopoverClose: () => void;
    tabIndex: number;
    setTabIndex: (tabIndex: number) => void;
};

/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function */
export const TableFiltersContext = createContext<TableFiltersContextT>({
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

export const useTableFiltersContext = (asset: AssetT): TableFiltersContextT => {
    const tableFilters = useRef<
        Record<
            string,
            {
                clear: React.RefObject<ClearCallbackT>;
                apply: React.RefObject<ApplyCallbackT>;
                reset: React.RefObject<ResetCallbackT>;
            }
        >
    >({});

    const setLocationParams = useSetLocationParams();

    const register: RegisterT = (name, clear, apply, reset) => {
        tableFilters.current[name] = {
            clear,
            apply,
            reset,
        };
    };

    const clearAll = useCallback(() => {
        const urlSearchParams = getUrlSearchParams();
        for (const tableFilter of Object.values(tableFilters.current)) {
            if (tableFilter.clear.current) {
                tableFilter.clear.current(urlSearchParams);
            }
        }
        setLocationParams(urlSearchParams);
    }, [setLocationParams]);

    const applyAll = useCallback(() => {
        const urlSearchParams = getUrlSearchParams();
        for (const tableFilter of Object.values(tableFilters.current)) {
            if (tableFilter.apply.current) {
                tableFilter.apply.current(urlSearchParams);
            }
        }
        urlSearchParams.set('page', '1');
        setLocationParams(urlSearchParams);
    }, [setLocationParams]);

    const resetAll = useCallback(() => {
        for (const tableFilter of Object.values(tableFilters.current)) {
            if (tableFilter.reset.current) {
                tableFilter.reset.current();
            }
        }
    }, []);

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
    const clearRef = useRef<ClearCallbackT | null>(null);
    const applyRef = useRef<ApplyCallbackT | null>(null);
    const resetRef = useRef<ResetCallbackT | null>(null);

    const { register } = useContext(TableFiltersContext);

    useEffectOnce(() => {
        register(filterKey, clearRef, applyRef, resetRef);
    });

    return {
        clearRef,
        applyRef,
        resetRef,
    };
};
