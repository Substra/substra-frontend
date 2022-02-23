import { PaginatedApiResponse } from '../common/CommonTypes';
import * as TasksApi from './TasksApi';
import {
    Aggregatetuple,
    AggregatetupleStub,
    CompositeTraintuple,
    CompositeTraintupleStub,
    TaskCategory,
    Testtuple,
    TesttupleStub,
    Traintuple,
    TraintupleStub,
} from './TuplesTypes';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';

import { SearchFilterType } from '@/libs/searchFilter';

interface TasksState {
    trainTasks: TraintupleStub[];
    trainTasksCount: number;
    trainTasksLoading: boolean;
    trainTasksError: string;

    testTasks: TesttupleStub[];
    testTasksCount: number;
    testTasksLoading: boolean;
    testTasksError: string;

    compositeTasks: CompositeTraintupleStub[];
    compositeTasksCount: number;
    compositeTasksLoading: boolean;
    compositeTasksError: string;

    aggregateTasks: AggregatetupleStub[];
    aggregateTasksCount: number;
    aggregateTasksLoading: boolean;
    aggregateTasksError: string;

    task: Traintuple | CompositeTraintuple | Aggregatetuple | Testtuple | null;
    taskLoading: boolean;
    taskError: string;

    logs: string;
    logsLoading: boolean;
    logsError: string;
}

const initialState: TasksState = {
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

    task: null,
    taskLoading: true,
    taskError: '',

    logs: '',
    logsLoading: true,
    logsError: '',
};

export interface listTasksArgs {
    filters: SearchFilterType[];
    page?: number;
}
export const listTrainTasks = createAsyncThunk<
    PaginatedApiResponse<TraintupleStub>,
    listTasksArgs,
    { rejectValue: string }
>(
    'tasks/listTrainTasks',
    async ({ filters, page }: listTasksArgs, thunkAPI) => {
        const trainFilters = filters.filter((sf) => sf.asset === 'traintuple');

        const nonTypeFilters = trainFilters.filter((sf) => sf.key !== 'type');

        try {
            const response = await TasksApi.listTraintuples(
                { searchFilters: nonTypeFilters, page },
                { signal: thunkAPI.signal }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue(error.response?.data);
            } else {
                throw error;
            }
        }
    }
);

export const listTestTasks = createAsyncThunk<
    PaginatedApiResponse<TesttupleStub>,
    listTasksArgs,
    { rejectValue: string }
>('tasks/listTestTasks', async ({ filters, page }: listTasksArgs, thunkAPI) => {
    const testFilters = filters.filter((sf) => sf.asset === 'testtuple');

    const nonTypeFilters = testFilters.filter((sf) => sf.key !== 'type');

    try {
        const response = await TasksApi.listTesttuples(
            { searchFilters: nonTypeFilters, page },
            { signal: thunkAPI.signal }
        );
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

export const listCompositeTasks = createAsyncThunk<
    PaginatedApiResponse<CompositeTraintupleStub>,
    listTasksArgs,
    { rejectValue: string }
>(
    'tasks/listCompositeTasks',
    async ({ filters, page }: listTasksArgs, thunkAPI) => {
        const compositeFilters = filters.filter(
            (sf) => (sf.asset = 'composite_traintuple')
        );

        const nonTypeFilters = compositeFilters.filter(
            (sf) => sf.key !== 'type'
        );

        try {
            const response = await TasksApi.listCompositeTraintuples(
                { searchFilters: nonTypeFilters, page },
                { signal: thunkAPI.signal }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue(error.response?.data);
            } else {
                throw error;
            }
        }
    }
);

export const listAggregateTasks = createAsyncThunk<
    PaginatedApiResponse<AggregatetupleStub>,
    listTasksArgs,
    { rejectValue: string }
>(
    'tasks/listAgreggateTasks',
    async ({ filters, page }: listTasksArgs, thunkAPI) => {
        const aggregateFilters = filters.filter(
            (sf) => sf.asset === 'aggregatetuple'
        );

        const nonTypeFilters = aggregateFilters.filter(
            (sf) => sf.key !== 'type'
        );

        try {
            const response = await TasksApi.listAggregatetuples(
                { searchFilters: nonTypeFilters, page },
                { signal: thunkAPI.signal }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue(error.response?.data);
            } else {
                throw error;
            }
        }
    }
);

const retrieveMethods: Record<
    TaskCategory,
    (
        key: string,
        config: AxiosRequestConfig
    ) => AxiosPromise<
        Testtuple | Traintuple | CompositeTraintuple | Aggregatetuple
    >
> = {
    [TaskCategory.test]: TasksApi.retrieveTesttuple,
    [TaskCategory.train]: TasksApi.retrieveTraintuple,
    [TaskCategory.composite]: TasksApi.retrieveCompositeTraintuple,
    [TaskCategory.aggregate]: TasksApi.retrieveAggregateTuple,
};
export const retrieveTask = createAsyncThunk<
    Traintuple | CompositeTraintuple | Aggregatetuple | Testtuple,
    { category: TaskCategory; key: string },
    { rejectValue: string }
>('tasks/get', async ({ category, key }, thunkAPI) => {
    const method = retrieveMethods[category];
    try {
        const response = await method(key, { signal: thunkAPI.signal });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
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
        if (axios.isAxiosError(error)) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

export const tasksSlice = createSlice({
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
