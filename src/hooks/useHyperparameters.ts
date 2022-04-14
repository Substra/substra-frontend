import { useMemo } from 'react';

import { useLocalStorageStringItems } from '@/hooks/useLocalStorageItems';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

export const useCustomHyperparameters = (): {
    customHyperparameters: string[];
    storeCustomHyperparameters: (hyperparameters: string[]) => void;
    clearCustomHyperparameters: () => void;
} => {
    // The type of the value stored for hyperparameters changed between releases 0.17.0 and 0.18.0.
    // We used to store a list of objects such as `{key: "epoch"}` when we now store a list of strings
    // In order to not have to do data migration, we opted to store the hyperparameters in a new localStorage variable.
    // - previously: in custom_hyperparameters_columns
    // - now: in custom_hyperparameters_columns_
    // This is also what we did for the `selected_compute_plans_` in the ComputePlans route
    const {
        items: customHyperparameters,
        setItems: storeCustomHyperparameters,
        clearItems: clearCustomHyperparameters,
    } = useLocalStorageStringItems('custom_hyperparameters_columns_');

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
