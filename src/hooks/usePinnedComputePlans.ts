import { useState } from 'react';

import { useCustomCompareEffect } from 'use-custom-compare';

import {
    ComputePlanT,
    isComputePlan,
} from '@/modules/computePlans/ComputePlansTypes';

const LOCAL_STORAGE_KEY = 'pinned_compute_plans';

const load = (): ComputePlanT[] => {
    const jsonItems = localStorage.getItem(LOCAL_STORAGE_KEY) || '[]';
    let items = [];
    try {
        items = JSON.parse(jsonItems);
    } catch {
        // do nothing
    }
    return items.filter(isComputePlan);
};

const save = (computePlans: ComputePlanT[]): void => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(computePlans));
};

const customCompare = (
    prevDeps: React.DependencyList,
    nextDeps: React.DependencyList
): boolean => {
    const prevItems: ComputePlanT[] = prevDeps[0] || [];
    const nextItems: ComputePlanT[] = nextDeps[0] || [];

    if (prevItems.length !== nextItems.length) {
        return false;
    }

    return prevItems.reduce(
        (areEqual: boolean, prevItem: ComputePlanT, index: number): boolean => {
            return areEqual && prevItem.key === nextItems[index].key;
        },
        true
    );
};

function usePinnedItems(): {
    pinnedItems: ComputePlanT[];
    pinItem: (item: ComputePlanT) => void;
    unpinItem: (item: ComputePlanT) => void;
} {
    const [items, setItems] = useState(load);

    useCustomCompareEffect(
        () => {
            save(items);
        },
        [items],
        customCompare
    );

    const addItem = (item: ComputePlanT) => {
        setItems([...items, item]);
    };

    const removeItem = (item: ComputePlanT) => {
        setItems(items.filter((i) => i.key !== item.key));
    };

    return {
        pinnedItems: items,
        pinItem: addItem,
        unpinItem: removeItem,
    };
}
export default usePinnedItems;
