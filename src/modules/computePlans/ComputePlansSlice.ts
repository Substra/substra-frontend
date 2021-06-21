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
import { AssetType } from '@/modules/common/CommonTypes';

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

export const listComputePlans = createAsyncThunk<
    ComputePlanType[],
    void,
    { rejectValue: string }
>('computePlans/list', async (_, thunkAPI) => {
    try {
        const response = await ComputePlansApi.listComputePlans();
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

export const retrieveComputePlanTrainTuples = createAsyncThunk<
    TrainTupleType[],
    string,
    { rejectValue: string }
>('computePlans/getTrainTuples', async (computePlanKey: string, thunkAPI) => {
    try {
        const searchFilters = [
            {
                asset: AssetType.traintuple,
                key: 'compute_plan_key',
                value: computePlanKey,
            },
        ];
        const response = await TuplesApi.listTrainTuples(searchFilters);

        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const retrieveComputePlanTestTuples = createAsyncThunk<
    TestTupleType[],
    string,
    { rejectValue: string }
>('computePlans/getTestTuples', async (computePlanKey: string, thunkAPI) => {
    try {
        const searchFilters = [
            {
                asset: AssetType.testtuple,
                key: 'compute_plan_key',
                value: computePlanKey,
            },
        ];
        const response = await TuplesApi.listTestTuples(searchFilters);

        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const retrieveComputePlanAggregateTuples = createAsyncThunk<
    AggregateTupleType[],
    string,
    { rejectValue: string }
>(
    'computePlans/getAggregateTuples',
    async (computePlanKey: string, thunkAPI) => {
        try {
            const searchFilters = [
                {
                    asset: AssetType.aggregatetuple,
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

export const retrieveComputePlanCompositeTuples = createAsyncThunk<
    CompositeTrainTupleType[],
    string,
    { rejectValue: string }
>(
    'computePlans/getCompositeTuples',
    async (computePlanKey: string, thunkAPI) => {
        try {
            const searchFilters = [
                {
                    asset: AssetType.composite_traintuple,
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
                state.computePlansError = payload || 'Unknown error';
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
                state.computePlanError = payload || 'Unknown error';
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
                    state.computePlanTrainTuplesError =
                        payload || 'Unknown error';
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
                    state.computePlanTestTuplesError =
                        payload || 'Unknown error';
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
                    state.computePlanAggregateTuplesError =
                        payload || 'Unknown error';
                }
            )
            .addCase(retrieveComputePlanCompositeTuples.pending, (state) => {
                state.computePlanCompositeTuplesLoading = true;
                state.computePlanCompositeTuplesError = '';
                state.computePlanCompositeTuples = [];
            })
            .addCase(
                retrieveComputePlanCompositeTuples.fulfilled,
                (state, { payload }) => {
                    state.computePlanCompositeTuples = payload;
                    state.computePlanCompositeTuplesLoading = false;
                    state.computePlanCompositeTuplesError = '';
                }
            )
            .addCase(
                retrieveComputePlanCompositeTuples.rejected,
                (state, { payload }) => {
                    state.computePlanCompositeTuplesLoading = false;
                    state.computePlanCompositeTuplesError =
                        payload || 'Unknown error';
                }
            );
    },
});

export default computePlansSlice.reducer;
