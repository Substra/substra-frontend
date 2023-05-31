import axios from 'axios';
import { create } from 'zustand';

import { listTasks } from '@/api/TasksApi';
import { withAbortSignal } from '@/api/request';
import { APIListArgsT, AbortFunctionT } from '@/types/CommonTypes';
import { TaskT } from '@/types/TasksTypes';

type TasksStateT = {
    tasks: TaskT[];
    tasksCount: number;
    fetchingTasks: boolean;
    fetchTasks: (params: APIListArgsT) => AbortFunctionT;
};

const useTasksStore = create<TasksStateT>((set) => ({
    tasks: [],
    tasksCount: 0,
    fetchingTasks: true,
    fetchTasks: withAbortSignal(async (signal, params) => {
        set({ fetchingTasks: true });
        try {
            const response = await listTasks(params, {
                signal,
            });
            set({
                fetchingTasks: false,
                tasks: response.data.results,
                tasksCount: response.data.count,
            });
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, the call has been canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingTasks: false });
            }
        }
    }),
}));

export default useTasksStore;
