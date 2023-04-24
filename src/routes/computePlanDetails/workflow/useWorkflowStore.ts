import axios from 'axios';
import { create } from 'zustand';

import { retrieveCPWorkflowGraph } from '@/api/CPWorkflowApi';
import { handleUnknownError } from '@/api/request';
import { TaskGraphT } from '@/types/CPWorkflowTypes';

type WorkflowStateT = {
    graph: TaskGraphT;
    fetchingGraph: boolean;
    graphError: string | null;
    fetchGraph: (computePlanKey: string) => void;
};

const emptyGraph = {
    tasks: [],
    edges: [],
};

let fetchController: AbortController | undefined;

const useWorkflowStore = create<WorkflowStateT>((set) => ({
    graph: emptyGraph,
    fetchingGraph: true,
    graphError: null,
    fetchGraph: async (computePlanKey: string) => {
        // abort previous call
        if (fetchController) {
            fetchController.abort();
        }

        fetchController = new AbortController();
        set({ fetchingGraph: true });
        try {
            const response = await retrieveCPWorkflowGraph(computePlanKey, {
                signal: fetchController.signal,
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
    },
}));

export default useWorkflowStore;
