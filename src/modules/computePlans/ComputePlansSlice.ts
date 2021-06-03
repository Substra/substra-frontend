import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { ComputePlanType } from './ComputePlansTypes';
import ComputePlansApi from './ComputePlansApi';

interface ComputePlansState {
    computePlans: ComputePlanType[];
    computePlansLoading: boolean;
    computePlansError: string;
}

const initialState: ComputePlansState = {
    computePlans: [],
    computePlansLoading: true,
    computePlansError: '',
};

export const listComputePlans = createAsyncThunk(
    'computePlans/list',
    async (_, thunkAPI) => {
        try {
            const response = await ComputePlansApi.listComputePlans();
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
                state.computePlansError = payload;
            });
    },
});

export default computePlansSlice.reducer;
