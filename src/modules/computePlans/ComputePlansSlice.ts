import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { PaginatedApiResponse } from '@/modules/common/CommonTypes';
import {
    Aggregatetuple,
    CompositeTraintupleStub,
    TesttupleStub,
    TraintupleStub,
} from '@/modules/tasks/TuplesTypes';

import * as ComputePlansApi from './ComputePlansApi';
import { ComputePlanStub, ComputePlanT } from './ComputePlansTypes';

interface ComputePlansState {
    computePlans: ComputePlanStub[];
    computePlansLoading: boolean;
    computePlansError: string;
    computePlansCount: number;
    computePlan: ComputePlanT | null;
    computePlanLoading: boolean;
    computePlanError: string;
    computePlanTrainTasks: TraintupleStub[];
    computePlanTrainTasksCount: number;
    computePlanTrainTasksLoading: boolean;
    computePlanTrainTasksError: string;
    computePlanTestTasks: TesttupleStub[];
    computePlanTestTasksCount: number;
    computePlanTestTasksLoading: boolean;
    computePlanTestTasksError: string;
    computePlanAggregateTasks: Aggregatetuple[];
    computePlanAggregateTasksCount: number;
    computePlanAggregateTasksLoading: boolean;
    computePlanAggregateTasksError: string;
    computePlanCompositeTasks: CompositeTraintupleStub[];
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

type listComputePlansArgs = {
    page?: number;
    match?: string;
    ordering?: string;
} & {
    [param: string]: unknown;
};

export const listComputePlans = createAsyncThunk<
    PaginatedApiResponse<ComputePlanStub>,
    listComputePlansArgs,
    { rejectValue: string }
>('computePlans/list', async (params: listComputePlansArgs, thunkAPI) => {
    try {
        const response = await ComputePlansApi.listComputePlans(params, {
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

export const retrieveComputePlan = createAsyncThunk<
    ComputePlanT,
    string,
    { rejectValue: string }
>('computePlans/get', async (key: string, thunkAPI) => {
    try {
        const response = await ComputePlansApi.retrieveComputePlan(key, {
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

export type retrieveComputePlanTasksArgs = {
    computePlanKey: string;
    page: number;
    ordering: string;
    match: string;
} & {
    [param: string]: unknown;
};

export const retrieveComputePlanTrainTasks = createAsyncThunk<
    PaginatedApiResponse<TraintupleStub>,
    retrieveComputePlanTasksArgs,
    { rejectValue: string }
>(
    'computePlans/getTrainTasks',
    async ({ computePlanKey, ...params }, thunkAPI) => {
        try {
            const response = await ComputePlansApi.listComputePlanTraintuples(
                {
                    key: computePlanKey,
                    ...params,
                },
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

export const retrieveComputePlanTestTasks = createAsyncThunk<
    PaginatedApiResponse<TesttupleStub>,
    retrieveComputePlanTasksArgs,
    { rejectValue: string }
>(
    'computePlans/getTestTasks',
    async ({ computePlanKey, ...params }, thunkAPI) => {
        try {
            const response = await ComputePlansApi.listComputePlanTesttuples(
                {
                    key: computePlanKey,
                    ...params,
                },
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

export const retrieveComputePlanAggregateTasks = createAsyncThunk<
    PaginatedApiResponse<Aggregatetuple>,
    retrieveComputePlanTasksArgs,
    { rejectValue: string }
>(
    'computePlans/getAggregateTasks',
    async ({ computePlanKey, ...params }, thunkAPI) => {
        try {
            const response =
                await ComputePlansApi.listComputePlanAggregatetuples(
                    {
                        key: computePlanKey,
                        ...params,
                    },
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

export const retrieveComputePlanCompositeTasks = createAsyncThunk<
    PaginatedApiResponse<CompositeTraintupleStub>,
    retrieveComputePlanTasksArgs,
    { rejectValue: string }
>(
    'computePlans/getCompositeTasks',
    async ({ computePlanKey, ...params }, thunkAPI) => {
        try {
            const response =
                await ComputePlansApi.listComputePlanCompositeTraintuples(
                    {
                        key: computePlanKey,
                        ...params,
                    },
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

const computePlansSlice = createSlice({
    name: 'computePlan',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listComputePlans.pending, (state) => {
                state.computePlans = [];
                state.computePlansLoading = true;
                state.computePlansError = '';
            })
            .addCase(listComputePlans.fulfilled, (state, { payload }) => {
                state.computePlans = payload.results;
                state.computePlansCount = payload.count;
                state.computePlansLoading = false;
                state.computePlansError = '';
            })
            .addCase(listComputePlans.rejected, (state, { payload, error }) => {
                if (error.name !== 'AbortError') {
                    state.computePlans = [];
                    state.computePlansCount = 0;
                    state.computePlansLoading = false;
                    state.computePlansError = payload || 'Unknown error';
                }
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
                (state, { payload, error }) => {
                    if (error.name !== 'AbortError') {
                        state.computePlanTrainTasks = [];
                        state.computePlanTrainTasksCount = 0;
                        state.computePlanTrainTasksLoading = false;
                        state.computePlanTrainTasksError =
                            payload || 'Unknown error';
                    }
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
                (state, { payload, error }) => {
                    if (error.name !== 'AbortError') {
                        state.computePlanTestTasks = [];
                        state.computePlanTestTasksCount = 0;
                        state.computePlanTestTasksLoading = false;
                        state.computePlanTestTasksError =
                            payload || 'Unknown error';
                    }
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
                (state, { payload, error }) => {
                    if (error.name !== 'AbortError') {
                        state.computePlanAggregateTasks = [];
                        state.computePlanAggregateTasksCount = 0;
                        state.computePlanAggregateTasksLoading = false;
                        state.computePlanAggregateTasksError =
                            payload || 'Unknown error';
                    }
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
                (state, { payload, error }) => {
                    if (error.name !== 'AbortError') {
                        state.computePlanCompositeTasks = [];
                        state.computePlanCompositeTasksCount = 0;
                        state.computePlanCompositeTasksLoading = false;
                        state.computePlanCompositeTasksError =
                            payload || 'Unknown error';
                    }
                }
            );
    },
});

export default computePlansSlice.reducer;
