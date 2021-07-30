import {
    AggregatetupleT,
    CompositeTraintupleT,
    TesttupleT,
    TraintupleT,
} from '../tasks/TuplesTypes';
import ComputePlansApi from './ComputePlansApi';
import { ComputePlanType } from './ComputePlansTypes';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import TasksApi from '@/modules/tasks/TasksApi';

import { SearchFilterType } from '@/libs/searchFilter';

interface ComputePlansState {
    computePlans: ComputePlanType[];
    computePlansLoading: boolean;
    computePlansError: string;
    computePlan: ComputePlanType | null;
    computePlanLoading: boolean;
    computePlanError: string;
    computePlanTrainTasks: TraintupleT[];
    computePlanTrainTasksLoading: boolean;
    computePlanTrainTasksError: string;
    computePlanTestTasks: TesttupleT[];
    computePlanTestTasksLoading: boolean;
    computePlanTestTasksError: string;
    computePlanAggregateTasks: AggregatetupleT[];
    computePlanAggregateTasksLoading: boolean;
    computePlanAggregateTasksError: string;
    computePlanCompositeTasks: CompositeTraintupleT[];
    computePlanCompositeTasksLoading: boolean;
    computePlanCompositeTasksError: string;
}

const initialState: ComputePlansState = {
    computePlans: [],
    computePlansLoading: true,
    computePlansError: '',
    computePlanLoading: true,
    computePlanError: '',
    computePlan: null,
    computePlanTrainTasks: [],
    computePlanTrainTasksLoading: true,
    computePlanTrainTasksError: '',
    computePlanTestTasks: [],
    computePlanTestTasksLoading: true,
    computePlanTestTasksError: '',
    computePlanAggregateTasks: [],
    computePlanAggregateTasksLoading: true,
    computePlanAggregateTasksError: '',
    computePlanCompositeTasks: [],
    computePlanCompositeTasksLoading: true,
    computePlanCompositeTasksError: '',
};

export const listComputePlans = createAsyncThunk<
    ComputePlanType[],
    SearchFilterType[],
    { rejectValue: string }
>('computePlans/list', async (searchFilters: SearchFilterType[], thunkAPI) => {
    try {
        const response = await ComputePlansApi.listComputePlans(searchFilters);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const retrieveComputePlan = createAsyncThunk<
    ComputePlanType,
    string,
    { rejectValue: string }
>('computePlans/get', async (key: string, thunkAPI) => {
    try {
        const response = await ComputePlansApi.retrieveComputePlan(key);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const retrieveComputePlanTrainTasks = createAsyncThunk<
    TraintupleT[],
    string,
    { rejectValue: string }
>('computePlans/getTrainTasks', async (computePlanKey: string, thunkAPI) => {
    try {
        const searchFilters: SearchFilterType[] = [
            {
                asset: 'traintuple',
                key: 'compute_plan_key',
                value: computePlanKey,
            },
        ];
        const response = await TasksApi.listTraintuples(searchFilters);

        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const retrieveComputePlanTestTasks = createAsyncThunk<
    TesttupleT[],
    string,
    { rejectValue: string }
>('computePlans/getTestTasks', async (computePlanKey: string, thunkAPI) => {
    try {
        const searchFilters: SearchFilterType[] = [
            {
                asset: 'testtuple',
                key: 'compute_plan_key',
                value: computePlanKey,
            },
        ];
        const response = await TasksApi.listTesttuples(searchFilters);

        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const retrieveComputePlanAggregateTasks = createAsyncThunk<
    AggregatetupleT[],
    string,
    { rejectValue: string }
>(
    'computePlans/getAggregateTasks',
    async (computePlanKey: string, thunkAPI) => {
        try {
            const searchFilters: SearchFilterType[] = [
                {
                    asset: 'aggregatetuple',
                    key: 'compute_plan_key',
                    value: computePlanKey,
                },
            ];
            const response = await TasksApi.listAggregatetuples(searchFilters);

            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const retrieveComputePlanCompositeTasks = createAsyncThunk<
    CompositeTraintupleT[],
    string,
    { rejectValue: string }
>(
    'computePlans/getCompositeTasks',
    async (computePlanKey: string, thunkAPI) => {
        try {
            const searchFilters: SearchFilterType[] = [
                {
                    asset: 'composite_traintuple',
                    key: 'compute_plan_key',
                    value: computePlanKey,
                },
            ];
            const response = await TasksApi.listCompositeTraintuples(
                searchFilters
            );

            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const computePlansSlice = createSlice({
    name: 'computePlan',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listComputePlans.pending, (state) => {
                state.computePlansLoading = true;
                state.computePlansError = '';
            })
            .addCase(listComputePlans.fulfilled, (state, { payload }) => {
                state.computePlans = payload;
                state.computePlansLoading = false;
                state.computePlansError = '';
            })
            .addCase(listComputePlans.rejected, (state, { payload }) => {
                state.computePlansLoading = false;
                state.computePlansError = payload || 'Unknown error';
            })
            .addCase(retrieveComputePlan.pending, (state) => {
                state.computePlanLoading = true;
                state.computePlanError = '';
                state.computePlan = null;
                state.computePlanTrainTasks = [];
                state.computePlanTestTasks = [];
                state.computePlanAggregateTasks = [];
                state.computePlanAggregateTasks = [];
            })
            .addCase(retrieveComputePlan.fulfilled, (state, { payload }) => {
                state.computePlan = payload;
                state.computePlanLoading = false;
                state.computePlanError = '';
            })
            .addCase(retrieveComputePlan.rejected, (state, { payload }) => {
                state.computePlanLoading = false;
                state.computePlanError = payload || 'Unknown error';
            })
            .addCase(retrieveComputePlanTrainTasks.pending, (state) => {
                state.computePlanTrainTasksLoading = true;
                state.computePlanTrainTasksError = '';
                state.computePlanTrainTasks = [];
            })
            .addCase(
                retrieveComputePlanTrainTasks.fulfilled,
                (state, { payload }) => {
                    state.computePlanTrainTasks = payload;
                    state.computePlanTrainTasksLoading = false;
                    state.computePlanTrainTasksError = '';
                }
            )
            .addCase(
                retrieveComputePlanTrainTasks.rejected,
                (state, { payload }) => {
                    state.computePlanTrainTasksLoading = false;
                    state.computePlanTrainTasksError =
                        payload || 'Unknown error';
                }
            )
            .addCase(retrieveComputePlanTestTasks.pending, (state) => {
                state.computePlanTestTasksLoading = true;
                state.computePlanTestTasksError = '';
                state.computePlanTestTasks = [];
            })
            .addCase(
                retrieveComputePlanTestTasks.fulfilled,
                (state, { payload }) => {
                    state.computePlanTestTasks = payload;
                    state.computePlanTestTasksLoading = false;
                    state.computePlanTestTasksError = '';
                }
            )
            .addCase(
                retrieveComputePlanTestTasks.rejected,
                (state, { payload }) => {
                    state.computePlanTestTasksLoading = false;
                    state.computePlanTestTasksError =
                        payload || 'Unknown error';
                }
            )
            .addCase(retrieveComputePlanAggregateTasks.pending, (state) => {
                state.computePlanAggregateTasksLoading = true;
                state.computePlanAggregateTasksError = '';
                state.computePlanAggregateTasks = [];
            })
            .addCase(
                retrieveComputePlanAggregateTasks.fulfilled,
                (state, { payload }) => {
                    state.computePlanAggregateTasks = payload;
                    state.computePlanAggregateTasksLoading = false;
                    state.computePlanAggregateTasksError = '';
                }
            )
            .addCase(
                retrieveComputePlanAggregateTasks.rejected,
                (state, { payload }) => {
                    state.computePlanAggregateTasksLoading = false;
                    state.computePlanAggregateTasksError =
                        payload || 'Unknown error';
                }
            )
            .addCase(retrieveComputePlanCompositeTasks.pending, (state) => {
                state.computePlanCompositeTasksLoading = true;
                state.computePlanCompositeTasksError = '';
                state.computePlanCompositeTasks = [];
            })
            .addCase(
                retrieveComputePlanCompositeTasks.fulfilled,
                (state, { payload }) => {
                    state.computePlanCompositeTasks = payload;
                    state.computePlanCompositeTasksLoading = false;
                    state.computePlanCompositeTasksError = '';
                }
            )
            .addCase(
                retrieveComputePlanCompositeTasks.rejected,
                (state, { payload }) => {
                    state.computePlanCompositeTasksLoading = false;
                    state.computePlanCompositeTasksError =
                        payload || 'Unknown error';
                }
            );
    },
});

export default computePlansSlice.reducer;
