import axios, { AxiosError } from 'axios';
import { create } from 'zustand';

import {
    listComputePlanTasks,
    retrieveComputePlan,
    updateComputePlan,
} from '@/api/ComputePlansApi';
import { APIRetrieveListArgsT } from '@/types/CommonTypes';
import { ComputePlanT } from '@/types/ComputePlansTypes';
import { TaskT } from '@/types/TasksTypes';

type ComputePlanStateT = {
    computePlan: ComputePlanT | null;
    computePlanTasks: TaskT[];
    computePlanTasksCount: number;

    fetchingComputePlan: boolean;
    fetchingComputePlanTasks: boolean;
    updatingComputePlan: boolean;

    fetchComputePlan: (key: string) => Promise<ComputePlanT | null>;
    fetchComputePlanTasks: (params: APIRetrieveListArgsT) => void;
    updateComputePlan: (key: string, name: string) => Promise<unknown>;
};

let fetchComputePlanController: AbortController | undefined;
let fetchComputePlanTasksController: AbortController | undefined;

const useComputePlanStore = create<ComputePlanStateT>((set) => ({
    computePlan: null,
    computePlanTasks: [],
    computePlanTasksCount: 0,
    fetchingComputePlan: false,
    fetchingComputePlanTasks: false,
    updatingComputePlan: false,
    fetchComputePlan: async (key: string) => {
        // abort previous call
        if (fetchComputePlanController) {
            fetchComputePlanController.abort();
        }

        fetchComputePlanController = new AbortController();
        set({ fetchingComputePlan: true });
        try {
            const response = await retrieveComputePlan(key, {
                signal: fetchComputePlanController.signal,
            });
            set({
                fetchingComputePlan: false,
                computePlan: response.data,
            });
            return response.data;
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, the call has been canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingComputePlan: false });
            }
            return null;
        }
    },
    fetchComputePlanTasks: async (params: APIRetrieveListArgsT) => {
        //abort previous call
        if (fetchComputePlanTasksController) {
            fetchComputePlanTasksController.abort();
        }

        fetchComputePlanTasksController = new AbortController();
        set({ fetchingComputePlanTasks: true });
        try {
            const response = await listComputePlanTasks(
                { ...params },
                {
                    signal: fetchComputePlanTasksController.signal,
                }
            );
            set({
                fetchingComputePlanTasks: false,
                computePlanTasks: response.data.results,
                computePlanTasksCount: response.data.count,
            });
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, the call has been canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingComputePlanTasks: false });
            }
        }
    },
    updateComputePlan: async (key: string, name: string) => {
        set({ updatingComputePlan: true });
        try {
            const response = await updateComputePlan(key, { name }, {});
            set({ updatingComputePlan: false, computePlan: response.data });
            return null;
        } catch (error) {
            set({ updatingComputePlan: false });
            console.warn(error);
            if (error instanceof AxiosError) {
                const data = error.response?.data;
                let msg;
                if (typeof data === 'object' && data.detail) {
                    msg = data.detail;
                } else {
                    msg = JSON.stringify(data);
                }
                return msg;
            }
            return error;
        }
    },
}));

export default useComputePlanStore;
