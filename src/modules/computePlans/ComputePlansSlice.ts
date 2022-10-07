import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { timestampNow } from '@/libs/utils';
import { PaginatedApiResponseT } from '@/modules/common/CommonTypes';
import * as ComputePlansApi from '@/modules/computePlans/ComputePlansApi';
import {
    ComputePlanStubT,
    ComputePlanT,
} from '@/modules/computePlans/ComputePlansTypes';
import { TaskT } from '@/modules/tasks/TasksTypes';

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
    computePlanTasks: TaskT[];
    computePlanTasksCount: number;
    computePlanTasksLoading: boolean;
    computePlanTasksError: string;
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
    computePlanTasks: [],
    computePlanTasksCount: 0,
    computePlanTasksLoading: true,
    computePlanTasksError: '',
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

export const retrieveComputePlanTasks = createAsyncThunk<
    PaginatedApiResponseT<TaskT>,
    RetrieveComputePlanTasksArgsProps,
    { rejectValue: string }
>('computePlans/getTasks', async ({ computePlanKey, ...params }, thunkAPI) => {
    try {
        const response = await ComputePlansApi.listComputePlanTasks(
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
});

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
                state.computePlanTasks = [];
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
            .addCase(retrieveComputePlanTasks.pending, (state) => {
                state.computePlanTasksLoading = true;
                state.computePlanTasksError = '';
                state.computePlanTasks = [];
            })
            .addCase(
                retrieveComputePlanTasks.fulfilled,
                (state, { payload }) => {
                    state.computePlanTasks = payload.results;
                    state.computePlanTasksCount = payload.count;
                    state.computePlanTasksLoading = false;
                    state.computePlanTasksError = '';
                }
            )
            .addCase(
                retrieveComputePlanTasks.rejected,
                (state, { payload, error }) => {
                    if (error.name !== 'AbortError') {
                        state.computePlanTasks = [];
                        state.computePlanTasksCount = 0;
                        state.computePlanTasksLoading = false;
                        state.computePlanTasksError =
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
