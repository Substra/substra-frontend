import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { APIAlgoType, AlgoType } from './AlgosTypes';
import AlgosApi from './AlgosApi';

interface AlgoState {
    algos: AlgoType[];
    algosLoading: boolean;
    algosError: string;

    algo: AlgoType | null;
    algoLoading: boolean;
    algoError: string;

    description: string;
    descriptionLoading: boolean;
    descriptionError: string;
}

const initialState: AlgoState = {
    algos: [],
    algosLoading: true,
    algosError: '',

    algo: null,
    algoLoading: true,
    algoError: '',

    description: '',
    descriptionLoading: true,
    descriptionError: '',
};

const addAlgoType = (type: 'standard' | 'aggregate' | 'composite') => (
    algo: APIAlgoType
): AlgoType => {
    return {
        ...algo,
        type,
    };
};

export const listAlgos = createAsyncThunk('algos/list', async (_, thunkAPI) => {
    try {
        // TODO: make all 3 calls in parallel
        const standardResponse = await AlgosApi.listStandardAlgos();
        const standardAlgos = standardResponse.data.map(
            addAlgoType('standard')
        );

        const compositeResponse = await AlgosApi.listCompositeAlgos();
        const compositeAlgos = compositeResponse.data.map(
            addAlgoType('composite')
        );

        const aggregateResponse = await AlgosApi.listAggregateAlgos();
        const aggregateAlgos = aggregateResponse.data.map(
            addAlgoType('aggregate')
        );

        return [...standardAlgos, ...compositeAlgos, ...aggregateAlgos];
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const retrieveAlgo = createAsyncThunk(
    'algos/get',
    async (key: string, thunkAPI) => {
        const errors = [];
        try {
            const response = await AlgosApi.retrieveStandardAlgo(key);
            return addAlgoType('standard')(response.data);
        } catch (err) {
            errors.push(err);
        }

        try {
            const response = await AlgosApi.retrieveCompositeAlgo(key);
            return addAlgoType('composite')(response.data);
        } catch (err) {
            errors.push(err);
        }

        try {
            const response = await AlgosApi.retrieveAggregateAlgo(key);
            return addAlgoType('aggregate')(response.data);
        } catch (err) {
            errors.push(err);
        }

        return thunkAPI.rejectWithValue(errors);
    }
);

export const retrieveDescription = createAsyncThunk(
    'algos/description',
    async (descriptionURL: string, thunkAPI) => {
        try {
            const response = await AlgosApi.retrieveDescription(descriptionURL);
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const algosSlice = createSlice({
    name: 'algo',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listAlgos.pending, (state) => {
                state.algosLoading = true;
                state.algosError = '';
            })
            .addCase(listAlgos.fulfilled, (state, { payload }) => {
                state.algos = payload;
                state.algosLoading = false;
                state.algosError = '';
            })
            .addCase(listAlgos.rejected, (state, { payload }) => {
                state.algosLoading = false;
                state.algosError = payload;
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
                state.algoError = payload;
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
                state.descriptionError = payload;
            });
    },
});

export default algosSlice.reducer;
