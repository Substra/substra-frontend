import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import {
    APIListArgsT,
    PaginatedApiResponseT,
} from '@/modules/common/CommonTypes';

import * as TasksApi from './TasksApi';
import { TaskT, TaskIOT } from './TasksTypes';

type TasksStateT = {
    tasks: TaskT[];
    tasksCount: number;
    tasksLoading: boolean;
    tasksError: string;

    task: TaskT | null;
    taskLoading: boolean;
    taskError: string;

    taskInputAssets: TaskIOT[];
    taskInputAssetsLoading: boolean;
    taskInputAssetsError: string;

    taskOutputAssets: TaskIOT[];
    taskOutputAssetsLoading: boolean;
    taskOutputAssetsError: string;

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

    taskInputAssets: [],
    taskInputAssetsLoading: true,
    taskInputAssetsError: '',

    taskOutputAssets: [],
    taskOutputAssetsLoading: true,
    taskOutputAssetsError: '',

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

export const listTaskInputAssets = createAsyncThunk<
    PaginatedApiResponseT<TaskIOT>,
    { key: string; params: APIListArgsT },
    { rejectValue: string }
>('tasks/listInputAssets', async ({ key, params }, thunkAPI) => {
    try {
        const response = await TasksApi.listTaskInputAssets(key, params, {
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

export const listTaskOutputAssets = createAsyncThunk<
    PaginatedApiResponseT<TaskIOT>,
    { key: string; params: APIListArgsT },
    { rejectValue: string }
>('tasks/listOutputAssets', async ({ key, params }, thunkAPI) => {
    try {
        const response = await TasksApi.listTaskOutputAssets(key, params, {
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
            .addCase(listTaskInputAssets.pending, (state) => {
                state.taskInputAssets = [];
                state.taskInputAssetsLoading = true;
                state.taskInputAssetsError = '';
            })
            .addCase(listTaskInputAssets.fulfilled, (state, { payload }) => {
                state.taskInputAssets = payload.results;
                state.taskInputAssetsLoading = false;
                state.taskInputAssetsError = '';
            })
            .addCase(listTaskInputAssets.rejected, (state, { payload }) => {
                state.taskInputAssets = [];
                state.taskInputAssetsLoading = false;
                state.taskInputAssetsError = payload || 'Unknown error';
            })
            .addCase(listTaskOutputAssets.pending, (state) => {
                state.taskOutputAssets = [];
                state.taskOutputAssetsLoading = true;
                state.taskOutputAssetsError = '';
            })
            .addCase(listTaskOutputAssets.fulfilled, (state, { payload }) => {
                state.taskOutputAssets = payload.results;
                state.taskOutputAssetsLoading = false;
                state.taskOutputAssetsError = '';
            })
            .addCase(listTaskOutputAssets.rejected, (state, { payload }) => {
                state.taskOutputAssets = [];
                state.taskOutputAssetsLoading = false;
                state.taskOutputAssetsError = payload || 'Unknown error';
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
