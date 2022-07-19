import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import * as ComputePlansApi from '@/modules/computePlans/ComputePlansApi';
import {
    ComputePlanStubT,
    ComputePlanT,
} from '@/modules/computePlans/ComputePlansTypes';

type CompareStateT = {
    computePlans: ComputePlanStubT[];
    loading: boolean;
    error: string;
};

const initialState: CompareStateT = {
    computePlans: [],
    loading: true,
    error: '',
};

type RetrieveComputePlansArgsProps = {
    computePlanKeys: string[];
};
export const retrieveComputePlans = createAsyncThunk<
    ComputePlanT[],
    RetrieveComputePlansArgsProps,
    { rejectValue: string }
>(
    'computePlans/getMultiple',
    async ({ computePlanKeys }: RetrieveComputePlansArgsProps, thunkAPI) => {
        const promises = computePlanKeys.map((computePlanKey) =>
            ComputePlansApi.retrieveComputePlan(computePlanKey, {
                signal: thunkAPI.signal,
            })
        );
        let responses;
        try {
            responses = await Promise.all(promises);
            return responses.map((response) => response.data);
        } catch (error) {
            if (error instanceof AxiosError) {
                return thunkAPI.rejectWithValue(error.response?.data);
            }

            throw error;
        }
    }
);

const compareSlice = createSlice({
    name: 'compare',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(retrieveComputePlans.pending, (state) => {
                state.computePlans = [];
                state.loading = true;
                state.error = '';
            })
            .addCase(retrieveComputePlans.fulfilled, (state, { payload }) => {
                state.computePlans = payload;
                state.loading = false;
                state.error = '';
            })
            .addCase(
                retrieveComputePlans.rejected,
                (state, { payload, error }) => {
                    if (error.name !== 'AbortError') {
                        state.computePlans = [];
                        state.loading = false;
                        state.error = payload || 'Unknown error';
                    }
                }
            );
    },
});

export default compareSlice.reducer;
