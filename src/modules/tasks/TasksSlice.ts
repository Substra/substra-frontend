import TasksApi from './TasksApi';
import {
    AggregatetupleT,
    AnyTupleT,
    CompositeTraintupleT,
    TesttupleT,
    TraintupleT,
} from './TuplesTypes';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { SearchFilterType } from '@/libs/searchFilter';

interface TasksState {
    trainTasks: TraintupleT[];
    trainTasksLoading: boolean;
    trainTasksError: string;

    testTasks: TesttupleT[];
    testTasksLoading: boolean;
    testTasksError: string;

    compositeTasks: CompositeTraintupleT[];
    compositeTasksLoading: boolean;
    compositeTasksError: string;

    aggregateTasks: AggregatetupleT[];
    aggregateTasksLoading: boolean;
    aggregateTasksError: string;

    task: AnyTupleT | null;
    taskLoading: boolean;
    taskError: string;
}

const initialState: TasksState = {
    trainTasks: [],
    trainTasksLoading: true,
    trainTasksError: '',

    testTasks: [],
    testTasksLoading: true,
    testTasksError: '',

    compositeTasks: [],
    compositeTasksLoading: true,
    compositeTasksError: '',

    aggregateTasks: [],
    aggregateTasksLoading: true,
    aggregateTasksError: '',

    task: null,
    taskLoading: true,
    taskError: '',
};

export const listTrainTasks = createAsyncThunk<
    TraintupleT[],
    SearchFilterType[],
    { rejectValue: string }
>('tasks/listTrainTasks', async (filters: SearchFilterType[], thunkAPI) => {
    const trainFilters = filters.filter((sf) => sf.asset === 'traintuple');

    const nonTypeFilters = trainFilters.filter((sf) => sf.key !== 'type');

    try {
        const response = await TasksApi.listTraintuples(nonTypeFilters);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const listTestTasks = createAsyncThunk<
    TesttupleT[],
    SearchFilterType[],
    { rejectValue: string }
>('tasks/listTestTasks', async (filters: SearchFilterType[], thunkAPI) => {
    const testFilters = filters.filter((sf) => sf.asset === 'testtuple');

    const nonTypeFilters = testFilters.filter((sf) => sf.key !== 'type');

    try {
        const response = await TasksApi.listTesttuples(nonTypeFilters);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const listCompositeTasks = createAsyncThunk<
    CompositeTraintupleT[],
    SearchFilterType[],
    { rejectValue: string }
>('tasks/listCompisiteTasks', async (filters: SearchFilterType[], thunkAPI) => {
    const compositeFilters = filters.filter(
        (sf) => (sf.asset = 'composite_traintuple')
    );

    const nonTypeFilters = compositeFilters.filter((sf) => sf.key !== 'type');

    try {
        const response = await TasksApi.listCompositeTraintuples(
            nonTypeFilters
        );
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const listAggregateTasks = createAsyncThunk<
    AggregatetupleT[],
    SearchFilterType[],
    { rejectValue: string }
>('tasks/listAgreggateTasks', async (filters: SearchFilterType[], thunkAPI) => {
    const aggregateFilters = filters.filter(
        (sf) => sf.asset === 'aggregatetuple'
    );

    const nonTypeFilters = aggregateFilters.filter((sf) => sf.key !== 'type');

    try {
        const response = await TasksApi.listAggregatetuples(nonTypeFilters);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const retrieveTask = createAsyncThunk<
    AnyTupleT,
    string,
    { rejectValue: string }
>('tasks/get', async (key: string, thunkAPI) => {
    const errors = [];
    try {
        const response = await TasksApi.retrieveTraintuple(key);
        return response.data;
    } catch (err) {
        errors.push(err);
    }
    try {
        const response = await TasksApi.retrieveCompositeTraintuple(key);
        return response.data;
    } catch (err) {
        errors.push(err);
    }
    try {
        const response = await TasksApi.retrieveAggregateTuple(key);
        return response.data;
    } catch (err) {
        errors.push(err);
    }
    try {
        const response = await TasksApi.retrieveTesttuple(key);
        return response.data;
    } catch (err) {
        errors.push(err);
    }

    return thunkAPI.rejectWithValue(errors.join(', '));
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
                state.trainTasks = payload;
                state.trainTasksLoading = false;
                state.trainTasksError = '';
            })
            .addCase(listTrainTasks.rejected, (state, { payload }) => {
                state.trainTasks = [];
                state.trainTasksLoading = false;
                state.trainTasksError = payload || 'Unknown error';
            })
            .addCase(listTestTasks.pending, (state) => {
                state.testTasks = [];
                state.testTasksLoading = true;
                state.testTasksError = '';
            })
            .addCase(listTestTasks.fulfilled, (state, { payload }) => {
                state.testTasks = payload;
                state.testTasksLoading = false;
                state.testTasksError = '';
            })
            .addCase(listTestTasks.rejected, (state, { payload }) => {
                state.testTasks = [];
                state.testTasksLoading = false;
                state.testTasksError = payload || 'Unknown error';
            })
            .addCase(listCompositeTasks.pending, (state) => {
                state.compositeTasks = [];
                state.compositeTasksLoading = true;
                state.compositeTasksError = '';
            })
            .addCase(listCompositeTasks.fulfilled, (state, { payload }) => {
                state.compositeTasks = payload;
                state.compositeTasksLoading = false;
                state.compositeTasksError = '';
            })
            .addCase(listCompositeTasks.rejected, (state, { payload }) => {
                state.compositeTasks = [];
                state.compositeTasksLoading = false;
                state.compositeTasksError = payload || 'Unknown error';
            })
            .addCase(listAggregateTasks.pending, (state) => {
                state.aggregateTasks = [];
                state.aggregateTasksLoading = true;
                state.aggregateTasksError = '';
            })
            .addCase(listAggregateTasks.fulfilled, (state, { payload }) => {
                state.aggregateTasks = payload;
                state.aggregateTasksLoading = false;
                state.aggregateTasksError = '';
            })
            .addCase(listAggregateTasks.rejected, (state, { payload }) => {
                state.aggregateTasks = [];
                state.aggregateTasksLoading = false;
                state.aggregateTasksError = payload || 'Unknown error';
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
            });
    },
});

export default tasksSlice.reducer;
