import axios from 'axios';
import { create } from 'zustand';

import { retrieveCPWorkflowGraph } from '@/api/CPWorkflowApi';
import { handleUnknownError, withAbortSignal } from '@/api/request';
import { TaskGraphT } from '@/types/CPWorkflowTypes';
import { AbortFunctionT } from '@/types/CommonTypes';

type WorkflowStateT = {
    graph: TaskGraphT;
    fetchingGraph: boolean;
    graphError: string | null;
    fetchGraph: (computePlanKey: string) => AbortFunctionT;
};

const emptyGraph = {
    tasks: [],
    edges: [],
};

const useWorkflowStore = create<WorkflowStateT>((set) => ({
    graph: emptyGraph,
    fetchingGraph: true,
    graphError: null,
    fetchGraph: withAbortSignal(async (signal, computePlanKey) => {
        set({ fetchingGraph: true });
        try {
            const response = await retrieveCPWorkflowGraph(computePlanKey, {
                signal,
            });
            set({
                fetchingGraph: false,
                graph: response.data,
            });
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, the call has been canceled voluntarily
            } else {
                console.warn(error);
                const graphError = handleUnknownError(error);
                set({ fetchingGraph: false, graphError });
            }
        }
    }),
}));

export default useWorkflowStore;
