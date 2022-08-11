import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { timestampNow } from '@/libs/utils';
import { PaginatedApiResponseT } from '@/modules/common/CommonTypes';
import * as ComputePlansApi from '@/modules/computePlans/ComputePlansApi';
import {
    ComputePlanStubT,
    ComputePlanT,
} from '@/modules/computePlans/ComputePlansTypes';
import {
    AggregatetupleT,
    CompositeTraintupleStubT,
    PredicttupleT,
    TesttupleStubT,
    TraintupleStubT,
} from '@/modules/tasks/TuplesTypes';

type ComputePlansStateT = {
    computePlans: ComputePlanStubT[];
    computePlansLoading: boolean;
    computePlansError: string;
    computePlansCount: number;
    computePlansCallTimestamp: string;
    computePlan: ComputePlanT | null;
    computePlanLoading: boolean;
    computePlanError: string;
    computePlanUpdating: boolean;
    computePlanUpdateError: string;
    computePlanTrainTasks: TraintupleStubT[];
    computePlanTrainTasksCount: number;
    computePlanTrainTasksLoading: boolean;
    computePlanTrainTasksError: string;
    computePlanTestTasks: TesttupleStubT[];
    computePlanTestTasksCount: number;
    computePlanTestTasksLoading: boolean;
    computePlanTestTasksError: string;
    computePlanAggregateTasks: AggregatetupleT[];
    computePlanAggregateTasksCount: number;
    computePlanAggregateTasksLoading: boolean;
    computePlanAggregateTasksError: string;
    computePlanCompositeTasks: CompositeTraintupleStubT[];
    computePlanCompositeTasksCount: number;
    computePlanCompositeTasksLoading: boolean;
    computePlanCompositeTasksError: string;
    computePlanPredictTasks: PredicttupleT[];
    computePlanPredictTasksCount: number;
    computePlanPredictTasksLoading: boolean;
    computePlanPredictTasksError: string;
};

const initialState: ComputePlansStateT = {
    computePlans: [],
    computePlansLoading: true,
    computePlansError: '',
    computePlansCount: 0,
    computePlansCallTimestamp: '',
    computePlanLoading: true,
    computePlanError: '',
    computePlan: null,
    computePlanUpdating: false,
    computePlanUpdateError: '',
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
    computePlanPredictTasks: [],
    computePlanPredictTasksCount: 0,
    computePlanPredictTasksLoading: true,
    computePlanPredictTasksError: '',
};

type ListComputePlansArgsProps = {
    page?: number;
    match?: string;
    ordering?: string;
} & {
    [param: string]: unknown;
};

export const listComputePlans = createAsyncThunk<
    PaginatedApiResponseT<ComputePlanStubT>,
    ListComputePlansArgsProps,
    { rejectValue: string }
>('computePlans/list', async (params: ListComputePlansArgsProps, thunkAPI) => {
    try {
        const response = await ComputePlansApi.listComputePlans(params, {
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
        if (error instanceof AxiosError) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

export type RetrieveComputePlanTasksArgsProps = {
    computePlanKey: string;
    page: number;
    ordering: string;
    match: string;
} & {
    [param: string]: unknown;
};

export const retrieveComputePlanTrainTasks = createAsyncThunk<
    PaginatedApiResponseT<TraintupleStubT>,
    RetrieveComputePlanTasksArgsProps,
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
            if (error instanceof AxiosError) {
                return thunkAPI.rejectWithValue(error.response?.data);
            } else {
                throw error;
            }
        }
    }
);

export const retrieveComputePlanTestTasks = createAsyncThunk<
    PaginatedApiResponseT<TesttupleStubT>,
    RetrieveComputePlanTasksArgsProps,
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
            if (error instanceof AxiosError) {
                return thunkAPI.rejectWithValue(error.response?.data);
            } else {
                throw error;
            }
        }
    }
);

export const retrieveComputePlanAggregateTasks = createAsyncThunk<
    PaginatedApiResponseT<AggregatetupleT>,
    RetrieveComputePlanTasksArgsProps,
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
            if (error instanceof AxiosError) {
                return thunkAPI.rejectWithValue(error.response?.data);
            } else {
                throw error;
            }
        }
    }
);

export const retrieveComputePlanCompositeTasks = createAsyncThunk<
    PaginatedApiResponseT<CompositeTraintupleStubT>,
    RetrieveComputePlanTasksArgsProps,
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
            if (error instanceof AxiosError) {
                return thunkAPI.rejectWithValue(error.response?.data);
            } else {
                throw error;
            }
        }
    }
);

export const retrieveComputePlanPredictTasks = createAsyncThunk<
    PaginatedApiResponseT<PredicttupleT>,
    RetrieveComputePlanTasksArgsProps,
    { rejectValue: string }
>(
    'computePlans/getPredictTasks',
    async ({ computePlanKey, ...params }, thunkAPI) => {
        try {
            const response = await ComputePlansApi.listComputePlanPredicttuples(
                {
                    key: computePlanKey,
                    ...params,
                },
                { signal: thunkAPI.signal }
            );
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                return thunkAPI.rejectWithValue(error.response?.data);
            } else {
                throw error;
            }
        }
    }
);

export const updateComputePlan = createAsyncThunk<
    ComputePlanT,
    { key: string; name: string },
    { rejectValue: string }
>('computePlans/update', async ({ key, name }, thunkAPI) => {
    try {
        await ComputePlansApi.updateComputePlan(
            key,
            { name },
            {
                signal: thunkAPI.signal,
            }
        );
        const response = await ComputePlansApi.retrieveComputePlan(key, {});
        response.data.name = name;
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            const data = error.response?.data;
            let msg;
            if (typeof data === 'object' && data.detail) {
                msg = data.detail;
            } else {
                msg = JSON.stringify(data);
            }
            return thunkAPI.rejectWithValue(msg);
        } else {
            throw error;
        }
    }
});

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
                state.computePlansCallTimestamp = timestampNow();
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
            )
            .addCase(retrieveComputePlanPredictTasks.pending, (state) => {
                state.computePlanPredictTasksLoading = true;
                state.computePlanPredictTasksError = '';
                state.computePlanPredictTasks = [];
            })
            .addCase(
                retrieveComputePlanPredictTasks.fulfilled,
                (state, { payload }) => {
                    state.computePlanPredictTasks = payload.results;
                    state.computePlanPredictTasksCount = payload.count;
                    state.computePlanPredictTasksLoading = false;
                    state.computePlanPredictTasksError = '';
                }
            )
            .addCase(
                retrieveComputePlanPredictTasks.rejected,
                (state, { payload, error }) => {
                    if (error.name !== 'AbortError') {
                        state.computePlanPredictTasks = [];
                        state.computePlanPredictTasksCount = 0;
                        state.computePlanPredictTasksLoading = false;
                        state.computePlanPredictTasksError =
                            payload || 'Unknown error';
                    }
                }
            )
            .addCase(updateComputePlan.pending, (state) => {
                state.computePlanUpdating = true;
                state.computePlanUpdateError = '';
            })
            .addCase(updateComputePlan.fulfilled, (state, { payload }) => {
                state.computePlan = payload;
                state.computePlanUpdating = false;
                state.computePlanUpdateError = '';
            })
            .addCase(updateComputePlan.rejected, (state, { payload }) => {
                state.computePlanUpdating = false;
                state.computePlanUpdateError = payload || 'Unknown error';
            });
    },
});

export default computePlansSlice.reducer;
