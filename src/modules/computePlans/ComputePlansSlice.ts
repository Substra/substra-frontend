import {
    AggregatetupleT,
    CompositeTraintupleT,
    TesttupleT,
    TraintupleT,
} from '../tasks/TuplesTypes';
import ComputePlansApi from './ComputePlansApi';
import { ComputePlanT } from './ComputePlansTypes';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { PaginatedApiResponse } from '@/modules/common/CommonTypes';
import TasksApi from '@/modules/tasks/TasksApi';

import { SearchFilterType } from '@/libs/searchFilter';

interface ComputePlansState {
    computePlans: ComputePlanT[];
    computePlansLoading: boolean;
    computePlansError: string;
    computePlansCount: number;
    computePlan: ComputePlanT | null;
    computePlanLoading: boolean;
    computePlanError: string;
    computePlanTrainTasks: TraintupleT[];
    computePlanTrainTasksCount: number;
    computePlanTrainTasksLoading: boolean;
    computePlanTrainTasksError: string;
    computePlanTestTasks: TesttupleT[];
    computePlanTestTasksCount: number;
    computePlanTestTasksLoading: boolean;
    computePlanTestTasksError: string;
    computePlanAggregateTasks: AggregatetupleT[];
    computePlanAggregateTasksCount: number;
    computePlanAggregateTasksLoading: boolean;
    computePlanAggregateTasksError: string;
    computePlanCompositeTasks: CompositeTraintupleT[];
    computePlanCompositeTasksCount: number;
    computePlanCompositeTasksLoading: boolean;
    computePlanCompositeTasksError: string;
}

const initialState: ComputePlansState = {
    computePlans: [],
    computePlansLoading: true,
    computePlansError: '',
    computePlansCount: 0,
    computePlanLoading: true,
    computePlanError: '',
    computePlan: null,
    computePlanTrainTasks: [],
    computePlanTrainTasksCount: 0,
    computePlanTrainTasksLoading: true,
    computePlanTrainTasksError: '',
    computePlanTestTasks: [],
    computePlanTestTasksCount: 0,
    computePlanTestTasksLoading: true,
    computePlanTestTasksError: '',
    computePlanAggregateTasks: [],
    computePlanAggregateTasksCount: 0,
    computePlanAggregateTasksLoading: true,
    computePlanAggregateTasksError: '',
    computePlanCompositeTasks: [],
    computePlanCompositeTasksCount: 0,
    computePlanCompositeTasksLoading: true,
    computePlanCompositeTasksError: '',
};

interface listComputePlansArgs {
    filters: SearchFilterType[];
    page: number;
}
export const listComputePlans = createAsyncThunk<
    PaginatedApiResponse<ComputePlanT>,
    listComputePlansArgs,
    { rejectValue: string }
>(
    'computePlans/list',
    async ({ filters, page }: listComputePlansArgs, thunkAPI) => {
        try {
            const response = await ComputePlansApi.listComputePlans(
                filters,
                page
            );
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const retrieveComputePlan = createAsyncThunk<
    ComputePlanT,
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

export interface retrieveComputePlanTasksArgs {
    computePlanKey: string;
    page?: number;
}

export const retrieveComputePlanTrainTasks = createAsyncThunk<
    PaginatedApiResponse<TraintupleT>,
    retrieveComputePlanTasksArgs,
    { rejectValue: string }
>('computePlans/getTrainTasks', async ({ computePlanKey, page }, thunkAPI) => {
    try {
        const searchFilters: SearchFilterType[] = [
            {
                asset: 'traintuple',
                key: 'compute_plan_key',
                value: computePlanKey,
            },
        ];
        const response = await TasksApi.listTraintuples(searchFilters, page);

        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const retrieveComputePlanTestTasks = createAsyncThunk<
    PaginatedApiResponse<TesttupleT>,
    retrieveComputePlanTasksArgs,
    { rejectValue: string }
>('computePlans/getTestTasks', async ({ computePlanKey, page }, thunkAPI) => {
    try {
        const searchFilters: SearchFilterType[] = [
            {
                asset: 'testtuple',
                key: 'compute_plan_key',
                value: computePlanKey,
            },
        ];
        const response = await TasksApi.listTesttuples(searchFilters, page);

        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const retrieveComputePlanAggregateTasks = createAsyncThunk<
    PaginatedApiResponse<AggregatetupleT>,
    retrieveComputePlanTasksArgs,
    { rejectValue: string }
>(
    'computePlans/getAggregateTasks',
    async ({ computePlanKey, page }, thunkAPI) => {
        try {
            const searchFilters: SearchFilterType[] = [
                {
                    asset: 'aggregatetuple',
                    key: 'compute_plan_key',
                    value: computePlanKey,
                },
            ];
            const response = await TasksApi.listAggregatetuples(
                searchFilters,
                page
            );

            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const retrieveComputePlanCompositeTasks = createAsyncThunk<
    PaginatedApiResponse<CompositeTraintupleT>,
    retrieveComputePlanTasksArgs,
    { rejectValue: string }
>(
    'computePlans/getCompositeTasks',
    async ({ computePlanKey, page }, thunkAPI) => {
        try {
            const searchFilters: SearchFilterType[] = [
                {
                    asset: 'composite_traintuple',
                    key: 'compute_plan_key',
                    value: computePlanKey,
                },
            ];
            const response = await TasksApi.listCompositeTraintuples(
                searchFilters,
                page
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
                state.computePlans = payload.results;
                state.computePlansCount = payload.count;
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
                    state.computePlanTrainTasks = payload.results;
                    state.computePlanTrainTasksCount = payload.count;
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
                    state.computePlanTestTasks = payload.results;
                    state.computePlanTestTasksCount = payload.count;
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
                    state.computePlanAggregateTasks = payload.results;
                    state.computePlanAggregateTasksCount = payload.count;
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
                    state.computePlanCompositeTasks = payload.results;
                    state.computePlanCompositeTasksCount = payload.count;
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
