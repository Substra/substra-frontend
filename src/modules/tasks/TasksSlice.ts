import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { PaginatedApiResponseT } from '@/modules/common/CommonTypes';

import * as TasksApi from './TasksApi';
import { TaskT } from './TasksTypes';

type TasksStateT = {
    tasks: TaskT[];
    tasksCount: number;
    tasksLoading: boolean;
    tasksError: string;

    task: TaskT | null;
    taskLoading: boolean;
    taskError: string;

    logs: string;
    logsLoading: boolean;
    logsError: string;
};

const initialState: TasksStateT = {
    tasks: [],
    tasksCount: 0,
    tasksLoading: true,
    tasksError: '',

    task: null,
    taskLoading: true,
    taskError: '',

    logs: '',
    logsLoading: true,
    logsError: '',
};

export type ListTasksProps = {
    page?: number;
    ordering?: string;
    match?: string;
} & {
    [param: string]: unknown;
};

export const listTasks = createAsyncThunk<
    PaginatedApiResponseT<TaskT>,
    ListTasksProps,
    { rejectValue: string }
>('tasks/listTasks', async (params: ListTasksProps, thunkAPI) => {
    try {
        const response = await TasksApi.listTasks(params, {
            signal: thunkAPI.signal,
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

export const retrieveTask = createAsyncThunk<
    TaskT,
    string,
    { rejectValue: string }
>('tasks/get', async (key: string, thunkAPI) => {
    try {
        const response = await TasksApi.retrieveTask(key, {
            signal: thunkAPI.signal,
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

export const retrieveLogs = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>('tasks/logs', async (key: string, thunkAPI) => {
    try {
        const response = await TasksApi.retrieveLogs(key, {
            signal: thunkAPI.signal,
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

const tasksSlice = createSlice({
    name: 'task',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listTasks.pending, (state) => {
                state.tasks = [];
                state.tasksLoading = true;
                state.tasksError = '';
            })
            .addCase(listTasks.fulfilled, (state, { payload }) => {
                state.tasks = payload.results;
                state.tasksCount = payload.count;
                state.tasksLoading = false;
                state.tasksError = '';
            })
            .addCase(listTasks.rejected, (state, { payload, error }) => {
                if (error.name !== 'AbortError') {
                    state.tasks = [];
                    state.tasksCount = 0;
                    state.tasksLoading = false;
                    state.tasksError = payload || 'Unknown error';
                }
            })
            .addCase(retrieveTask.pending, (state) => {
                state.taskLoading = true;
                state.taskError = '';
                state.task = null;
            })
            .addCase(retrieveTask.fulfilled, (state, { payload }) => {
                state.taskLoading = false;
                state.taskError = '';
                state.task = payload;
            })
            .addCase(retrieveTask.rejected, (state, { payload }) => {
                state.taskLoading = false;
                state.taskError = payload || 'Unknown error';
                state.task = null;
            })
            .addCase(retrieveLogs.pending, (state) => {
                state.logsLoading = true;
                state.logsError = '';
                state.logs = '';
            })
            .addCase(retrieveLogs.fulfilled, (state, { payload }) => {
                state.logsLoading = false;
                state.logsError = '';
                state.logs = payload;
            })
            .addCase(retrieveLogs.rejected, (state, { payload }) => {
                state.logsLoading = false;
                state.logsError = payload || 'Unknown error';
                state.logs = '';
            });
    },
});

export default tasksSlice.reducer;
