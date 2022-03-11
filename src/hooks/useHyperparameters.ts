import { useMemo } from 'react';

import useLocalStorageItems from '@/hooks/useLocalStorageItems';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

export interface customHyperparametersT {
    key: string;
}
export const useCustomHyperparameters = (): {
    customHyperparameters: customHyperparametersT[];
    replaceCustomHyperparameters: (
        hyperparameters: customHyperparametersT[]
    ) => void;
    clearCustomHyperparameters: () => void;
} => {
    const {
        items: customHyperparameters,
        replaceItems: replaceCustomHyperparameters,
        clearItems: clearCustomHyperparameters,
    } = useLocalStorageItems<customHyperparametersT>(
        'custom_hyperparameters_columns'
    );

    return {
        customHyperparameters,
        replaceCustomHyperparameters,
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
