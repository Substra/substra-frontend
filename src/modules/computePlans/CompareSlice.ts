import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import * as ComputePlansApi from '@/modules/computePlans/ComputePlansApi';
import {
    ComputePlanStub,
    ComputePlanT,
} from '@/modules/computePlans/ComputePlansTypes';

interface CompareState {
    computePlans: ComputePlanStub[];
    loading: boolean;
    error: string;
}

const initialState: CompareState = {
    computePlans: [],
    loading: true,
    error: '',
};

interface retrieveComputePlansArgs {
    computePlanKeys: string[];
}
export const retrieveComputePlans = createAsyncThunk<
    ComputePlanT[],
    retrieveComputePlansArgs,
    { rejectValue: string }
>(
    'computePlans/getMultiple',
    async ({ computePlanKeys }: retrieveComputePlansArgs, thunkAPI) => {
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
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue(error.response?.data);
            } else {
                throw error;
            }
        }
    }
);

export const compareSlice = createSlice({
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
            .addCase(retrieveComputePlans.rejected, (state, { payload }) => {
                state.computePlans = [];
                state.loading = false;
                state.error = payload || 'Unknown error';
            });
    },
});

export default compareSlice.reducer;
