import axios from 'axios';
import { create } from 'zustand';

import { retrieveCPWorkflowGraph } from '@/api/CPWorkflowApi';
import { TaskGraphT } from '@/types/CPWorkflowTypes';

type WorkflowStateT = {
    graph: TaskGraphT;
    fetchingGraph: boolean;
    fetchGraph: (computePlanKey: string) => void;
};

const emptyGraph = {
    tasks: [],
    edges: [],
};

let fetchController: AbortController | undefined;

const useWorkflowStore = create<WorkflowStateT>((set) => ({
    graph: emptyGraph,
    fetchingGraph: false,
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
                set({ fetchingGraph: false });
            }
        }
    },
}));

export default useWorkflowStore;
