import axios from 'axios';
import { create } from 'zustand';

import {
    retrieveLogs,
    retrieveTask,
    retrieveTaskProfiling,
} from '@/api/TasksApi';
import { TaskProfilingT, TaskT } from '@/types/TasksTypes';

type TaskStateT = {
    task: TaskT | null;
    taskProfiling: TaskProfilingT | null;
    logs: string;

    fetchingTask: boolean;
    fetchingTaskProfiling: boolean;
    fetchingLogs: boolean;

    fetchTask: (key: string) => void;
    fetchTaskProfiling: (key: string) => void;
    fetchLogs: (key: string) => void;
};

let fetchTaskController: AbortController | undefined;
let fetchTaskProfilingController: AbortController | undefined;
let fetchLogsController: AbortController | undefined;

const useTaskStore = create<TaskStateT>((set) => ({
    task: null,
    taskProfiling: null,
    logs: '',
    fetchingTask: true,
    fetchingTaskProfiling: true,
    fetchingLogs: true,
    fetchTask: async (key: string) => {
        // abort previous call
        if (fetchTaskController) {
            fetchTaskController.abort();
        }

        fetchTaskController = new AbortController();
        set({ fetchingTask: true, task: null });
        try {
            const response = await retrieveTask(key, {
                signal: fetchTaskController.signal,
            });
            set({
                fetchingTask: false,
                task: response.data,
            });
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, the call was canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingTask: false });
            }
        }
    },
    fetchTaskProfiling: async (key: string) => {
        // abort previous call
        if (fetchTaskProfilingController) {
            fetchTaskProfilingController.abort();
        }

        fetchTaskProfilingController = new AbortController();
        set({ fetchingTaskProfiling: true, taskProfiling: null });
        try {
            const response = await retrieveTaskProfiling(key, {
                signal: fetchTaskProfilingController.signal,
            });
            set({
                fetchingTaskProfiling: false,
                taskProfiling: response.data,
            });
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, the call was canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingTaskProfiling: false });
            }
        }
    },
    fetchLogs: async (key: string) => {
        // abort previous call
        if (fetchLogsController) {
            fetchLogsController.abort();
        }

        fetchLogsController = new AbortController();
        set({ fetchingLogs: true, logs: '' });
        try {
            const response = await retrieveLogs(key, {
                signal: fetchLogsController.signal,
            });
            set({
                fetchingLogs: false,
                logs: response.data,
            });
        } catch (error) {
            if (axios.isCancel(error)) {
                // do nothing, the call was canceled voluntarily
            } else {
                console.warn(error);
                set({ fetchingLogs: false });
            }
        }
    },
}));

export default useTaskStore;
