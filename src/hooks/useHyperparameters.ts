import { useMemo } from 'react';

import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

import useAppSelector from '@/hooks/useAppSelector';

declare const HYPERPARAMETERS: string[];

const useHyperparameters = (): string[] => {
    const computePlans: ComputePlanT[] = useAppSelector(
        (state) => state.computePlans.computePlans
    );

    const hyperparametersList = useMemo<string[]>(() => {
        const hyperparamsList: string[] = [];

        for (const computePlan of computePlans) {
            for (const data in computePlan.metadata) {
                /**
                 * Fill an array containing every hyperparameter for all the compute plans
                 * To be used to define Thead columns for hyperparameters in the table
                 */
                if (
                    HYPERPARAMETERS.includes(data) &&
                    !hyperparamsList.includes(data)
                ) {
                    hyperparamsList.push(data);
                }
            }
        }
        return hyperparamsList;
    }, [computePlans]);

    return hyperparametersList;
};

export default useHyperparameters;
