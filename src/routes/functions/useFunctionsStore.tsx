import axios from 'axios';
import { create } from 'zustand';

import { listFunctions } from '@/api/FunctionsApi';
import { withAbortSignal } from '@/api/request';
import { APIListArgsT, AbortFunctionT } from '@/types/CommonTypes';
import { FunctionT } from '@/types/FunctionsTypes';

type FunctionsStateT = {
    functions: FunctionT[];
    functionsCount: number;
    fetchingFunctions: boolean;
    fetchFunctions: (params: APIListArgsT) => AbortFunctionT;
};

const useFunctionsStore = create<FunctionsStateT>((set) => ({
    functions: [],
    functionsCount: 0,
    fetchingFunctions: true,
    fetchFunctions: withAbortSignal(async (signal, params) => {
        set({ fetchingFunctions: true });
        try {
            const response = await listFunctions(params, {
                signal,
            });
            set({
                fetchingFunctions: false,
                functions: response.data.results,
                functionsCount: response.data.count,
            });
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, call has been canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingFunctions: false });
            }
        }
    }),
}));

export default useFunctionsStore;
