import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { SearchFilterType } from '@/libs/searchFilter';
import * as CommonApi from '@/modules/common/CommonApi';
import { PaginatedApiResponse } from '@/modules/common/CommonTypes';

import * as AlgosApi from './AlgosApi';
import { AlgoT } from './AlgosTypes';

interface AlgoState {
    algos: AlgoT[];
    algosCount: number;
    algosLoading: boolean;
    algosError: string;

    algo: AlgoT | null;
    algoLoading: boolean;
    algoError: string;

    description: string;
    descriptionLoading: boolean;
    descriptionError: string;
}

const initialState: AlgoState = {
    algos: [],
    algosCount: 0,
    algosLoading: true,
    algosError: '',

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
    ordering: string;
    match: string;
}

export const listAlgos = createAsyncThunk<
    PaginatedApiResponse<AlgoT>,
    listAlgosArgs,
    { rejectValue: string }
>(
    'algos/listAlgos',
    async ({ filters, page, ordering, match }: listAlgosArgs, thunkAPI) => {
        try {
            const standardFilters = filters.filter((sf) => sf.asset === 'algo');

            const response = await AlgosApi.listAlgos(
                { searchFilters: standardFilters, page, ordering, match },
                { signal: thunkAPI.signal }
            );

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue(error.response?.data);
            } else {
                throw error;
            }
        }
    }
);

export const retrieveAlgo = createAsyncThunk<
    AlgoT,
    string,
    { rejectValue: string }
>('algos/get', async (key: string, thunkAPI) => {
    try {
        const response = await AlgosApi.retrieveAlgo(key, {
            signal: thunkAPI.signal,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

export const retrieveDescription = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>('algos/description', async (descriptionURL: string, thunkAPI) => {
    try {
        const response = await CommonApi.retrieveDescription(descriptionURL, {
            signal: thunkAPI.signal,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

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
                state.algos = payload.results;
                state.algosCount = payload.count;
                state.algosLoading = false;
                state.algosError = '';
            })
            .addCase(listAlgos.rejected, (state, { payload, error }) => {
                if (error.name !== 'AbortError') {
                    state.algos = [];
                    state.algosCount = 0;
                    state.algosLoading = false;
                    state.algosError = payload || 'Unknown error';
                }
            })
            .addCase(retrieveAlgo.pending, (state) => {
                state.algoLoading = true;
                state.algo = null;
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
