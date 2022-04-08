import { useMemo } from 'react';

import { useLocalStorageStringItems } from '@/hooks/useLocalStorageItems';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

export const useCustomHyperparameters = (): {
    customHyperparameters: string[];
    storeCustomHyperparameters: (hyperparameters: string[]) => void;
    clearCustomHyperparameters: () => void;
} => {
    const {
        items: customHyperparameters,
        setItems: storeCustomHyperparameters,
        clearItems: clearCustomHyperparameters,
    } = useLocalStorageStringItems('custom_hyperparameters_columns');

    return {
        customHyperparameters,
        storeCustomHyperparameters,
        clearCustomHyperparameters,
    };
};

const useHyperparameters = (computePlans: ComputePlanT[]): string[] => {
    const hyperparametersList = useMemo<string[]>(() => {
        const hyperparamsList: string[] = [];
        for (const hp of HYPERPARAMETERS) {
            for (const computePlan of computePlans) {
                /**
                 * Fill an array containing every hyperparameter for all the compute plans
                 * To be used to define Thead columns for hyperparameters in the table
                 */
                if (computePlan.metadata[hp] && !hyperparamsList.includes(hp)) {
                    hyperparamsList.push(hp);
                }
            }
        }
        return hyperparamsList;
    }, [computePlans]);
    return hyperparametersList;
};

export default useHyperparameters;
