import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import CommonApi from '@/modules/common/CommonApi';

import { APIAlgoType, AlgoType } from './AlgosTypes';
import AlgosApi from './AlgosApi';
import { SearchFilterType } from '@/libs/searchFilter';
import { AssetType } from '@/modules/common/CommonTypes';

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

export const listAlgos = createAsyncThunk(
    'algos/list',
    async (filters: SearchFilterType[], thunkAPI) => {
        try {
            const standardFilters = filters.filter(
                (sf) => sf.asset === AssetType.algo
            );
            const compositeFilters = filters.filter(
                (sf) => sf.asset === AssetType.composite_algo
            );
            const aggregateFilters = filters.filter(
                (sf) => sf.asset === AssetType.aggregate_algo
            );

            const promises = [
                AlgosApi.listStandardAlgos(standardFilters),
                AlgosApi.listCompositeAlgos(compositeFilters),
                AlgosApi.listAggregateAlgos(aggregateFilters),
            ];

            const responses = await Promise.all(promises);

            const standardAlgos = responses[0].data.map(
                addAlgoType('standard')
            );

            const compositeAlgos = responses[1].data.map(
                addAlgoType('composite')
            );

            const aggregateAlgos = responses[2].data.map(
                addAlgoType('aggregate')
            );

            return [...standardAlgos, ...compositeAlgos, ...aggregateAlgos];
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

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
            const response = await CommonApi.retrieveDescription(
                descriptionURL
            );
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
