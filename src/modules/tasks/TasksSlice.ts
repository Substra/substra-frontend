import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosPromise, AxiosResponse } from 'axios';

import { SearchFilterType } from '@/libs/searchFilter';

import { AnyTaskT, TaskType } from './TasksTypes';
import TasksApi from './TasksApi';
import { AnyTupleT } from './TuplesTypes';

interface TasksState {
    tasks: AnyTaskT[];
    tasksLoading: boolean;
    tasksError: string;

    task: AnyTaskT | null;
    taskLoading: boolean;
    taskError: string;
}

const initialState: TasksState = {
    tasks: [],
    tasksLoading: true,
    tasksError: '',

    task: null,
    taskLoading: true,
    taskError: '',
};

const addTaskType = (type: TaskType) => (tuple: AnyTupleT): AnyTaskT => {
    return {
        ...tuple,
        type,
    } as AnyTaskT;
};

export const listTasks = createAsyncThunk<
    AnyTaskT[],
    SearchFilterType[],
    { rejectValue: string }
>('tasks/list', async (filters: SearchFilterType[], thunkAPI) => {
    const taskFilters = filters.filter((sf) =>
        [
            'traintuple',
            'composite_traintuple',
            'aggregatetuple',
            'testtuple',
        ].includes(sf.asset)
    );
    const typeFilters = taskFilters.filter((sf) => sf.key === 'type');
    const nonTypeFilters = taskFilters.filter((sf) => sf.key !== 'type');

    const requestedTypes = typeFilters.map((sf) => sf.value);

    const listTuplesByType: {
        [key in TaskType]: (
            sf: SearchFilterType[]
        ) => AxiosPromise<AnyTupleT[]>;
    } = {
        traintuple: TasksApi.listTraintuples,
        testtuple: TasksApi.listTesttuples,
        composite_traintuple: TasksApi.listCompositeTraintuples,
        aggregatetuple: TasksApi.listAggregatetuples,
    };

    try {
        const promises: AxiosPromise<AnyTupleT[]>[] = [];
        const responseParsers: ((
            response: AxiosResponse<AnyTupleT[]>
        ) => AnyTaskT[])[] = [];

        for (const [type, listTuples] of Object.entries(listTuplesByType)) {
            if (requestedTypes.length === 0 || requestedTypes.includes(type)) {
                promises.push(
                    listTuples(
                        nonTypeFilters.filter((sf) => sf.asset === type)
                    ) as AxiosPromise<AnyTupleT[]>
                );
                responseParsers.push((response: AxiosResponse<AnyTupleT[]>) =>
                    response.data.map(addTaskType(type as TaskType))
                );
            }
        }

        const responses = await Promise.all(promises);

        const result = responses.reduce(
            (tasks: AnyTaskT[], response, index): AnyTaskT[] => {
                return [...tasks, ...responseParsers[index](response)];
            },
            []
        );

        return result;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const retrieveTask = createAsyncThunk<
    AnyTaskT,
    string,
    { rejectValue: string }
>('tasks/get', async (key: string, thunkAPI) => {
    const errors = [];
    try {
        const response = await TasksApi.retrieveTraintuple(key);
        return addTaskType('traintuple')(response.data);
    } catch (err) {
        errors.push(err);
    }
    try {
        const response = await TasksApi.retrieveCompositeTraintuple(key);
        return addTaskType('composite_traintuple')(response.data);
    } catch (err) {
        errors.push(err);
    }
    try {
        const response = await TasksApi.retrieveAggregateTuple(key);
        return addTaskType('aggregatetuple')(response.data);
    } catch (err) {
        errors.push(err);
    }
    try {
        const response = await TasksApi.retrieveTesttuple(key);
        return addTaskType('testtuple')(response.data);
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
            .addCase(listTasks.pending, (state) => {
                state.tasks = [];
                state.tasksLoading = true;
                state.tasksError = '';
            })
            .addCase(listTasks.fulfilled, (state, { payload }) => {
                state.tasks = payload;
                state.tasksLoading = false;
                state.tasksError = '';
            })
            .addCase(listTasks.rejected, (state, { payload }) => {
                state.tasks = [];
                state.tasksLoading = false;
                state.tasksError = payload || 'Unknown error';
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
