import axios from 'axios';
import { create } from 'zustand';

import { listComputePlans } from '@/api/ComputePlansApi';
import { timestampNow } from '@/libs/utils';
import { APIListArgsT } from '@/types/CommonTypes';
import { ComputePlanStubT } from '@/types/ComputePlansTypes';

type ComputePlansStateT = {
    computePlans: ComputePlanStubT[];
    computePlansCount: number;
    computePlansCallTimestamp: string;
    fetchingComputePlans: boolean;
    fetchComputePlans: (params: APIListArgsT) => void;
};

let fetchController: AbortController | undefined;

const useComputePlansStore = create<ComputePlansStateT>((set) => ({
    computePlans: [],
    computePlansCount: 0,
    computePlansCallTimestamp: '',
    fetchingComputePlans: false,
    fetchComputePlans: async (params: APIListArgsT) => {
        // abort previous call
        if (fetchController) {
            fetchController.abort();
        }

        fetchController = new AbortController();

        set({ fetchingComputePlans: true });

        try {
            const response = await listComputePlans(params, {
                signal: fetchController.signal,
            });
            set({
                fetchingComputePlans: false,
                computePlans: response.data.results,
                computePlansCount: response.data.count,
                computePlansCallTimestamp: timestampNow(),
            });
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, the call has been canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingComputePlans: false });
            }
        }
    },
}));
export default useComputePlansStore;
