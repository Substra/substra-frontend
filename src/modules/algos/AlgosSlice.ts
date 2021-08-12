import { PaginatedApiResponse } from '../common/CommonTypes';
import AlgosApi from './AlgosApi';
import { AlgoT } from './AlgosTypes';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import CommonApi from '@/modules/common/CommonApi';

import { SearchFilterType } from '@/libs/searchFilter';

interface AlgoState {
    standardAlgos: AlgoT[];
    standardAlgosCount: number;
    standardAlgosLoading: boolean;
    standardAlgosError: string;

    compositeAlgos: AlgoT[];
    compositeAlgosCount: number;
    compositeAlgosLoading: boolean;
    compositeAlgosError: string;

    aggregateAlgos: AlgoT[];
    aggregateAlgosCount: number;
    aggregateAlgosLoading: boolean;
    aggregateAlgosError: string;

    algo: AlgoT | null;
    algoLoading: boolean;
    algoError: string;

    description: string;
    descriptionLoading: boolean;
    descriptionError: string;
}

const initialState: AlgoState = {
    standardAlgos: [],
    standardAlgosCount: 0,
    standardAlgosLoading: true,
    standardAlgosError: '',

    compositeAlgos: [],
    compositeAlgosCount: 0,
    compositeAlgosLoading: true,
    compositeAlgosError: '',

    aggregateAlgos: [],
    aggregateAlgosCount: 0,
    aggregateAlgosLoading: true,
    aggregateAlgosError: '',

    algo: null,
    algoLoading: true,
    algoError: '',

    description: '',
    descriptionLoading: true,
    descriptionError: '',
};

export interface listAlgosArgs {
    filters: SearchFilterType[];
    page: number;
}

export const listStandardAlgos = createAsyncThunk<
    PaginatedApiResponse<AlgoT>,
    listAlgosArgs,
    { rejectValue: string }
>(
    'algos/listStandardAlgos',
    async ({ filters, page }: listAlgosArgs, thunkAPI) => {
        try {
            const standardFilters = filters.filter((sf) => sf.asset === 'algo');

            const response = await AlgosApi.listStandardAlgos(
                standardFilters,
                page
            );

            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const listCompositeAlgos = createAsyncThunk<
    PaginatedApiResponse<AlgoT>,
    listAlgosArgs,
    { rejectValue: string }
>(
    'algos/listCompositeAlgos',
    async ({ filters, page }: listAlgosArgs, thunkAPI) => {
        try {
            const compositeFilters = filters.filter(
                (sf) => sf.asset === 'composite_algo'
            );

            const response = await AlgosApi.listCompositeAlgos(
                compositeFilters,
                page
            );

            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const listAggregateAlgos = createAsyncThunk<
    PaginatedApiResponse<AlgoT>,
    listAlgosArgs,
    { rejectValue: string }
>(
    'algos/listAggregateAlgos',
    async ({ filters, page }: listAlgosArgs, thunkAPI) => {
        try {
            const aggregateFilters = filters.filter(
                (sf) => sf.asset === 'aggregate_algo'
            );

            const response = await AlgosApi.listAggregateAlgos(
                aggregateFilters,
                page
            );

            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const retrieveAlgo = createAsyncThunk<
    AlgoT,
    string,
    { rejectValue: string }
>('algos/get', async (key: string, thunkAPI) => {
    const errors = [];
    try {
        const response = await AlgosApi.retrieveStandardAlgo(key);
        return response.data;
    } catch (err) {
        errors.push(err);
    }

    try {
        const response = await AlgosApi.retrieveCompositeAlgo(key);
        return response.data;
    } catch (err) {
        errors.push(err);
    }

    try {
        const response = await AlgosApi.retrieveAggregateAlgo(key);
        return response.data;
    } catch (err) {
        errors.push(err);
    }

    return thunkAPI.rejectWithValue(errors.join(', '));
});

export const retrieveDescription = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>('algos/description', async (descriptionURL: string, thunkAPI) => {
    try {
        const response = await CommonApi.retrieveDescription(descriptionURL);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const algosSlice = createSlice({
    name: 'algo',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listStandardAlgos.pending, (state) => {
                state.standardAlgosLoading = true;
                state.standardAlgosError = '';
            })
            .addCase(listStandardAlgos.fulfilled, (state, { payload }) => {
                state.standardAlgos = payload.results;
                state.standardAlgosCount = payload.count;
                state.standardAlgosLoading = false;
                state.standardAlgosError = '';
            })
            .addCase(listStandardAlgos.rejected, (state, { payload }) => {
                state.standardAlgosLoading = false;
                state.standardAlgosError = payload || 'Unknown error';
            })
            .addCase(listCompositeAlgos.pending, (state) => {
                state.compositeAlgosLoading = true;
                state.compositeAlgosError = '';
            })
            .addCase(listCompositeAlgos.fulfilled, (state, { payload }) => {
                state.compositeAlgos = payload.results;
                state.compositeAlgosCount = payload.count;
                state.compositeAlgosLoading = false;
                state.compositeAlgosError = '';
            })
            .addCase(listCompositeAlgos.rejected, (state, { payload }) => {
                state.compositeAlgosLoading = false;
                state.compositeAlgosError = payload || 'Unknown error';
            })
            .addCase(listAggregateAlgos.pending, (state) => {
                state.aggregateAlgosLoading = true;
                state.aggregateAlgosError = '';
            })
            .addCase(listAggregateAlgos.fulfilled, (state, { payload }) => {
                state.aggregateAlgos = payload.results;
                state.aggregateAlgosCount = payload.count;
                state.aggregateAlgosLoading = false;
                state.aggregateAlgosError = '';
            })
            .addCase(listAggregateAlgos.rejected, (state, { payload }) => {
                state.aggregateAlgosLoading = false;
                state.aggregateAlgosError = payload || 'Unknown error';
            })
            .addCase(retrieveAlgo.pending, (state) => {
                state.algoLoading = true;
                state.algoError = '';
            })
            .addCase(retrieveAlgo.fulfilled, (state, { payload }) => {
                state.algoLoading = false;
                state.algoError = '';
                state.algo = payload;
            })
            .addCase(retrieveAlgo.rejected, (state, { payload }) => {
                state.algoLoading = false;
                state.algoError = payload || 'Unknown error';
            })
            .addCase(retrieveDescription.pending, (state) => {
                state.descriptionLoading = true;
                state.descriptionError = '';
            })
            .addCase(retrieveDescription.fulfilled, (state, { payload }) => {
                state.descriptionLoading = false;
                state.descriptionError = '';
                state.description = payload;
            })
            .addCase(retrieveDescription.rejected, (state, { payload }) => {
                state.descriptionLoading = false;
                state.descriptionError = payload || 'Unknown error';
            });
    },
});

export default algosSlice.reducer;
