import axios, { AxiosPromise } from 'axios';
import { create } from 'zustand';

import { retrieveComputePlan } from '@/api/ComputePlansApi';
import { withAbortSignal } from '@/api/request';
import { AbortFunctionT } from '@/types/CommonTypes';
import { ComputePlanT } from '@/types/ComputePlansTypes';

type CompareStateT = {
    computePlans: ComputePlanT[];
    fetchingComputePlans: boolean;
    fetchComputePlans: (computePlanKeys: string[]) => AbortFunctionT;
};

const useCompareStore = create<CompareStateT>((set) => ({
    computePlans: [],
    fetchingComputePlans: true,
    fetchComputePlans: withAbortSignal(async (signal, computePlanKeys) => {
        set({ fetchingComputePlans: true });
        let promises: AxiosPromise<ComputePlanT>[] = [];

        promises = computePlanKeys.map((computePlanKey) =>
            retrieveComputePlan(computePlanKey, {
                signal,
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
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, the call has been canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingComputePlans: false });
            }
        }
    }),
}));

export default useCompareStore;
