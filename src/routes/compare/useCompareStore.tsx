import axios, { AxiosPromise } from 'axios';
import { create } from 'zustand';

import { retrieveComputePlan } from '@/api/ComputePlansApi';
import { ComputePlanT } from '@/types/ComputePlansTypes';

type CompareStateT = {
    computePlans: ComputePlanT[];
    fetchingComputePlans: boolean;
    fetchComputePlans: (
        computePlanKeys: string[]
    ) => Promise<ComputePlanT[] | null>;
};

let fetchController: AbortController | undefined;

const useCompareStore = create<CompareStateT>((set) => ({
    computePlans: [],
    fetchingComputePlans: false,
    fetchComputePlans: async (computePlanKeys: string[]) => {
        //abort previous call
        if (fetchController) {
            fetchController.abort();
        }

        fetchController = new AbortController();

        set({ fetchingComputePlans: true });
        let promises: AxiosPromise<ComputePlanT>[] = [];

        promises = computePlanKeys.map((computePlanKey) =>
            retrieveComputePlan(computePlanKey, {
                signal: (fetchController as AbortController).signal,
            })
        );

        let responses;

        try {
            responses = await Promise.all(promises);
            const results = responses.map((response) => response.data);
            set({
                computePlans: results,
                fetchingComputePlans: false,
            });

            return results;
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, the call has been canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingComputePlans: false });
            }
        }
        return null;
    },
}));

export default useCompareStore;
