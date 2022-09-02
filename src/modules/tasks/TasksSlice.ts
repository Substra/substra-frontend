import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError, AxiosPromise, AxiosRequestConfig } from 'axios';

import { PaginatedApiResponseT } from '@/modules/common/CommonTypes';

import * as TasksApi from './TasksApi';
import {
    AggregatetupleT,
    AggregatetupleStubT,
    CompositeTraintupleT,
    CompositeTraintupleStubT,
    PredicttupleT,
    PredicttupleStubT,
    TaskCategory,
    TesttupleT,
    TesttupleStubT,
    TraintupleT,
    TraintupleStubT,
    AnyFullTupleT,
} from './TuplesTypes';

type TasksStateT = {
    trainTasks: TraintupleStubT[];
    trainTasksCount: number;
    trainTasksLoading: boolean;
    trainTasksError: string;

    testTasks: TesttupleStubT[];
    testTasksCount: number;
    testTasksLoading: boolean;
    testTasksError: string;

    compositeTasks: CompositeTraintupleStubT[];
    compositeTasksCount: number;
    compositeTasksLoading: boolean;
    compositeTasksError: string;

    aggregateTasks: AggregatetupleStubT[];
    aggregateTasksCount: number;
    aggregateTasksLoading: boolean;
    aggregateTasksError: string;

    predictTasks: PredicttupleStubT[];
    predictTasksCount: number;
    predictTasksLoading: boolean;
    predictTasksError: string;

    task: AnyFullTupleT | null;
    taskLoading: boolean;
    taskError: string;

    logs: string;
    logsLoading: boolean;
    logsError: string;
};

const initialState: TasksStateT = {
    trainTasks: [],
    trainTasksCount: 0,
    trainTasksLoading: true,
    trainTasksError: '',

    testTasks: [],
    testTasksCount: 0,
    testTasksLoading: true,
    testTasksError: '',

    compositeTasks: [],
    compositeTasksCount: 0,
    compositeTasksLoading: true,
    compositeTasksError: '',

    aggregateTasks: [],
    aggregateTasksCount: 0,
    aggregateTasksLoading: true,
    aggregateTasksError: '',

    predictTasks: [],
    predictTasksCount: 0,
    predictTasksLoading: true,
    predictTasksError: '',

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

export const listTrainTasks = createAsyncThunk<
    PaginatedApiResponseT<TraintupleStubT>,
    ListTasksProps,
    { rejectValue: string }
>('tasks/listTrainTasks', async (params: ListTasksProps, thunkAPI) => {
    try {
        const response = await TasksApi.listTraintuples(params, {
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

export const listTestTasks = createAsyncThunk<
    PaginatedApiResponseT<TesttupleStubT>,
    ListTasksProps,
    { rejectValue: string }
>('tasks/listTestTasks', async (params: ListTasksProps, thunkAPI) => {
    try {
        const response = await TasksApi.listTesttuples(params, {
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

export const listCompositeTasks = createAsyncThunk<
    PaginatedApiResponseT<CompositeTraintupleStubT>,
    ListTasksProps,
    { rejectValue: string }
>('tasks/listCompositeTasks', async (params: ListTasksProps, thunkAPI) => {
    try {
        const response = await TasksApi.listCompositeTraintuples(params, {
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

export const listAggregateTasks = createAsyncThunk<
    PaginatedApiResponseT<AggregatetupleStubT>,
    ListTasksProps,
    { rejectValue: string }
>('tasks/listAggregateTasks', async (params: ListTasksProps, thunkAPI) => {
    try {
        const response = await TasksApi.listAggregatetuples(params, {
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

export const listPredictTasks = createAsyncThunk<
    PaginatedApiResponseT<PredicttupleStubT>,
    ListTasksProps,
    { rejectValue: string }
>('tasks/listPredictTasks', async (params: ListTasksProps, thunkAPI) => {
    try {
        const response = await TasksApi.listPredicttuples(params, {
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

const retrieveMethods: Record<
    TaskCategory,
    (
        key: string,
        config: AxiosRequestConfig
    ) => AxiosPromise<
        | TesttupleT
        | TraintupleT
        | CompositeTraintupleT
        | AggregatetupleT
        | PredicttupleT
    >
> = {
    [TaskCategory.test]: TasksApi.retrieveTesttuple,
    [TaskCategory.train]: TasksApi.retrieveTraintuple,
    [TaskCategory.composite]: TasksApi.retrieveCompositeTraintuple,
    [TaskCategory.aggregate]: TasksApi.retrieveAggregateTuple,
    [TaskCategory.predict]: TasksApi.retrievePredicttuple,
};
export const retrieveTask = createAsyncThunk<
    | TraintupleT
    | CompositeTraintupleT
    | AggregatetupleT
    | TesttupleT
    | PredicttupleT,
    { category: TaskCategory; key: string },
    { rejectValue: string }
>('tasks/get', async ({ category, key }, thunkAPI) => {
    const method = retrieveMethods[category];
    try {
        const response = await method(key, { signal: thunkAPI.signal });
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
            .addCase(listTrainTasks.pending, (state) => {
                state.trainTasks = [];
                state.trainTasksLoading = true;
                state.trainTasksError = '';
            })
            .addCase(listTrainTasks.fulfilled, (state, { payload }) => {
                state.trainTasks = payload.results;
                state.trainTasksCount = payload.count;
                state.trainTasksLoading = false;
                state.trainTasksError = '';
            })
            .addCase(listTrainTasks.rejected, (state, { payload, error }) => {
                if (error.name !== 'AbortError') {
                    state.trainTasks = [];
                    state.trainTasksCount = 0;
                    state.trainTasksLoading = false;
                    state.trainTasksError = payload || 'Unknown error';
                }
            })
            .addCase(listTestTasks.pending, (state) => {
                state.testTasks = [];
                state.testTasksLoading = true;
                state.testTasksError = '';
            })
            .addCase(listTestTasks.fulfilled, (state, { payload }) => {
                state.testTasks = payload.results;
                state.testTasksCount = payload.count;
                state.testTasksLoading = false;
                state.testTasksError = '';
            })
            .addCase(listTestTasks.rejected, (state, { payload, error }) => {
                if (error.name !== 'AbortError') {
                    state.testTasks = [];
                    state.testTasksCount = 0;
                    state.testTasksLoading = false;
                    state.testTasksError = payload || 'Unknown error';
                }
            })
            .addCase(listCompositeTasks.pending, (state) => {
                state.compositeTasks = [];
                state.compositeTasksLoading = true;
                state.compositeTasksError = '';
            })
            .addCase(listCompositeTasks.fulfilled, (state, { payload }) => {
                state.compositeTasks = payload.results;
                state.compositeTasksCount = payload.count;
                state.compositeTasksLoading = false;
                state.compositeTasksError = '';
            })
            .addCase(
                listCompositeTasks.rejected,
                (state, { payload, error }) => {
                    if (error.name !== 'AbortError') {
                        state.compositeTasks = [];
                        state.compositeTasksCount = 0;
                        state.compositeTasksLoading = false;
                        state.compositeTasksError = payload || 'Unknown error';
                    }
                }
            )
            .addCase(listAggregateTasks.pending, (state) => {
                state.aggregateTasks = [];
                state.aggregateTasksLoading = true;
                state.aggregateTasksError = '';
            })
            .addCase(listAggregateTasks.fulfilled, (state, { payload }) => {
                state.aggregateTasks = payload.results;
                state.aggregateTasksCount = payload.count;
                state.aggregateTasksLoading = false;
                state.aggregateTasksError = '';
            })
            .addCase(
                listAggregateTasks.rejected,
                (state, { payload, error }) => {
                    if (error.name !== 'AbortError') {
                        state.aggregateTasks = [];
                        state.aggregateTasksCount = 0;
                        state.aggregateTasksLoading = false;
                        state.aggregateTasksError = payload || 'Unknown error';
                    }
                }
            )
            .addCase(listPredictTasks.pending, (state) => {
                state.predictTasks = [];
                state.predictTasksLoading = true;
                state.predictTasksError = '';
            })
            .addCase(listPredictTasks.fulfilled, (state, { payload }) => {
                state.predictTasks = payload.results;
                state.predictTasksCount = payload.count;
                state.predictTasksLoading = false;
                state.predictTasksError = '';
            })
            .addCase(listPredictTasks.rejected, (state, { payload, error }) => {
                if (error.name !== 'AbortError') {
                    state.predictTasks = [];
                    state.predictTasksCount = 0;
                    state.predictTasksLoading = false;
                    state.predictTasksError = payload || 'Unknown error';
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
