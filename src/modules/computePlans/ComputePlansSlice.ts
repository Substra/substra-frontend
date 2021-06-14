import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { ComputePlanType } from './ComputePlansTypes';
import ComputePlansApi from './ComputePlansApi';
import TuplesApi from '@/modules/tuples/TuplesApi';
import {
    TestTupleType,
    TrainTupleType,
    CompositeTrainTupleType,
    AggregateTupleType,
} from '@/modules/tuples/TuplesTypes';

interface ComputePlansState {
    computePlans: ComputePlanType[];
    computePlansLoading: boolean;
    computePlansError: string;
    computePlan: ComputePlanType | null;
    computePlanLoading: boolean;
    computePlanError: string;
    computePlanTrainTuples: TrainTupleType[];
    computePlanTrainTuplesLoading: boolean;
    computePlanTrainTuplesError: string;
    computePlanTestTuples: TestTupleType[];
    computePlanTestTuplesLoading: boolean;
    computePlanTestTuplesError: string;
    computePlanAggregateTuples: AggregateTupleType[];
    computePlanAggregateTuplesLoading: boolean;
    computePlanAggregateTuplesError: string;
    computePlanCompositeTuples: CompositeTrainTupleType[];
    computePlanCompositeTuplesLoading: boolean;
    computePlanCompositeTuplesError: string;
}

const initialState: ComputePlansState = {
    computePlans: [],
    computePlansLoading: true,
    computePlansError: '',
    computePlanLoading: true,
    computePlanError: '',
    computePlan: null,
    computePlanTrainTuples: [],
    computePlanTrainTuplesLoading: true,
    computePlanTrainTuplesError: '',
    computePlanTestTuples: [],
    computePlanTestTuplesLoading: true,
    computePlanTestTuplesError: '',
    computePlanAggregateTuples: [],
    computePlanAggregateTuplesLoading: true,
    computePlanAggregateTuplesError: '',
    computePlanCompositeTuples: [],
    computePlanCompositeTuplesLoading: true,
    computePlanCompositeTuplesError: '',
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

export const retrieveComputePlan = createAsyncThunk(
    'computePlans/get',
    async (key: string, thunkAPI) => {
        try {
            const response = await ComputePlansApi.retrieveComputePlan(key);
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const retrieveComputePlanTrainTuples = createAsyncThunk(
    'computePlans/getTrainTuples',
    async (computePlanKey: string, thunkAPI) => {
        try {
            const searchFilters = [
                {
                    asset: 'traintuple',
                    key: 'compute_plan_key',
                    value: computePlanKey,
                },
            ];
            const response = await TuplesApi.listTrainTuples(searchFilters);

            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const retrieveComputePlanTestTuples = createAsyncThunk(
    'computePlans/getTestTuples',
    async (computePlanKey: string, thunkAPI) => {
        try {
            const searchFilters = [
                {
                    asset: 'testtuple',
                    key: 'compute_plan_key',
                    value: computePlanKey,
                },
            ];
            const response = await TuplesApi.listTestTuples(searchFilters);

            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const retrieveComputePlanAggregateTuples = createAsyncThunk(
    'computePlans/getAggregateTuples',
    async (computePlanKey: string, thunkAPI) => {
        try {
            const searchFilters = [
                {
                    asset: 'aggregatetuple',
                    key: 'compute_plan_key',
                    value: computePlanKey,
                },
            ];
            const response = await TuplesApi.listAggregateTuples(searchFilters);

            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const retrieveComputePlanCompositeTuples = createAsyncThunk(
    'computePlans/getCompositeTuples',
    async (computePlanKey: string, thunkAPI) => {
        try {
            const searchFilters = [
                {
                    asset: 'composite_traintuple',
                    key: 'compute_plan_key',
                    value: computePlanKey,
                },
            ];
            const response = await TuplesApi.listCompositeTuples(searchFilters);

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
            })
            .addCase(retrieveComputePlan.pending, (state) => {
                state.computePlanLoading = true;
                state.computePlanError = '';
            })
            .addCase(retrieveComputePlan.fulfilled, (state, { payload }) => {
                state.computePlan = payload;
                state.computePlanLoading = false;
                state.computePlanError = '';
            })
            .addCase(retrieveComputePlan.rejected, (state, { payload }) => {
                state.computePlanLoading = false;
                state.computePlanError = payload;
            })
            .addCase(retrieveComputePlanTrainTuples.pending, (state) => {
                state.computePlanTrainTuplesLoading = true;
                state.computePlanTrainTuplesError = '';
                state.computePlanTrainTuples = [];
            })
            .addCase(
                retrieveComputePlanTrainTuples.fulfilled,
                (state, { payload }) => {
                    state.computePlanTrainTuples = payload;
                    state.computePlanTrainTuplesLoading = false;
                    state.computePlanTrainTuplesError = '';
                }
            )
            .addCase(
                retrieveComputePlanTrainTuples.rejected,
                (state, { payload }) => {
                    state.computePlanTrainTuplesLoading = false;
                    state.computePlanTrainTuplesError = payload;
                }
            )
            .addCase(retrieveComputePlanTestTuples.pending, (state) => {
                state.computePlanTestTuplesLoading = true;
                state.computePlanTestTuplesError = '';
                state.computePlanTestTuples = [];
            })
            .addCase(
                retrieveComputePlanTestTuples.fulfilled,
                (state, { payload }) => {
                    state.computePlanTestTuples = payload;
                    state.computePlanTestTuplesLoading = false;
                    state.computePlanTestTuplesError = '';
                }
            )
            .addCase(
                retrieveComputePlanTestTuples.rejected,
                (state, { payload }) => {
                    state.computePlanTestTuplesLoading = false;
                    state.computePlanTestTuplesError = payload;
                }
            )
            .addCase(retrieveComputePlanAggregateTuples.pending, (state) => {
                state.computePlanAggregateTuplesLoading = true;
                state.computePlanAggregateTuplesError = '';
                state.computePlanAggregateTuples = [];
            })
            .addCase(
                retrieveComputePlanAggregateTuples.fulfilled,
                (state, { payload }) => {
                    state.computePlanAggregateTuples = payload;
                    state.computePlanAggregateTuplesLoading = false;
                    state.computePlanAggregateTuplesError = '';
                }
            )
            .addCase(
                retrieveComputePlanAggregateTuples.rejected,
                (state, { payload }) => {
                    state.computePlanAggregateTuplesLoading = false;
                    state.computePlanAggregateTuplesError = payload;
                }
            )
            .addCase(retrieveComputePlanCompositeTuples.pending, (state) => {
                state.computePlanAggregateTuplesLoading = true;
                state.computePlanAggregateTuplesError = '';
                state.computePlanAggregateTuples = [];
            })
            .addCase(
                retrieveComputePlanCompositeTuples.fulfilled,
                (state, { payload }) => {
                    state.computePlanAggregateTuples = payload;
                    state.computePlanAggregateTuplesLoading = false;
                    state.computePlanAggregateTuplesError = '';
                }
            )
            .addCase(
                retrieveComputePlanCompositeTuples.rejected,
                (state, { payload }) => {
                    state.computePlanAggregateTuplesLoading = false;
                    state.computePlanAggregateTuplesError = payload;
                }
            );
    },
});

export default computePlansSlice.reducer;
