import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { SearchFilterType } from '@/libs/searchFilter';
import * as CommonApi from '@/modules/common/CommonApi';
import { PaginatedApiResponse } from '@/modules/common/CommonTypes';

import * as DatasetAPI from './DatasetsApi';
import { DatasetType, DatasetStubType } from './DatasetsTypes';

interface DatasetState {
    datasets: DatasetStubType[];
    datasetsCount: number;
    datasetsLoading: boolean;
    datasetsError: string;

    dataset: DatasetType | null;
    datasetLoading: boolean;
    datasetError: string;

    description: string;
    descriptionLoading: boolean;
    descriptionError: string;

    opener: string;
    openerLoading: boolean;
    openerError: string;
}

const initialState: DatasetState = {
    datasets: [],
    datasetsCount: 0,
    datasetsLoading: true,
    datasetsError: '',

    dataset: null,
    datasetLoading: true,
    datasetError: '',

    description: '',
    descriptionLoading: true,
    descriptionError: '',

    opener: '',
    openerLoading: true,
    openerError: '',
};

interface listDatasetsArgs {
    filters: SearchFilterType[];
    page: number;
}
export const listDatasets = createAsyncThunk<
    PaginatedApiResponse<DatasetStubType>,
    listDatasetsArgs,
    { rejectValue: string }
>('datasets/list', async ({ filters, page }: listDatasetsArgs, thunkAPI) => {
    try {
        const response = await DatasetAPI.listDatasets(
            { searchFilters: filters, page },
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
});

export const retrieveDataset = createAsyncThunk<
    DatasetType,
    string,
    { rejectValue: string }
>('datasets/get', async (key: string, thunkAPI) => {
    try {
        const response = await DatasetAPI.retrieveDataset(key, {
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
>('datasets/description', async (descriptionURL: string, thunkAPI) => {
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

export const retrieveOpener = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>('datasets/opener', async (openerURL: string, thunkAPI) => {
    try {
        const response = await DatasetAPI.retrieveOpener(openerURL, {
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

export const datasetsSlice = createSlice({
    name: 'dataset',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listDatasets.pending, (state) => {
                state.datasetsLoading = true;
                state.datasetsError = '';
            })
            .addCase(listDatasets.fulfilled, (state, { payload }) => {
                state.datasets = payload.results;
                state.datasetsCount = payload.count;
                state.datasetsLoading = false;
                state.datasetsError = '';
            })
            .addCase(listDatasets.rejected, (state, { payload, error }) => {
                if (error.name !== 'AbortError') {
                    state.datasets = [];
                    state.datasetsCount = 0;
                    state.datasetsLoading = false;
                    state.datasetsError = payload || 'Unknown error';
                }
            })
            .addCase(retrieveDataset.pending, (state) => {
                state.datasetLoading = true;
                state.datasetError = '';
            })
            .addCase(retrieveDataset.fulfilled, (state, { payload }) => {
                state.datasetLoading = false;
                state.datasetError = '';
                state.dataset = payload;
            })
            .addCase(retrieveDataset.rejected, (state, { payload }) => {
                state.datasetLoading = false;
                state.datasetError = payload || 'Unknown error';
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
            })
            .addCase(retrieveOpener.pending, (state) => {
                state.openerLoading = true;
                state.openerError = '';
            })
            .addCase(retrieveOpener.fulfilled, (state, { payload }) => {
                state.openerLoading = false;
                state.openerError = '';
                state.opener = payload;
            })
            .addCase(retrieveOpener.rejected, (state, { payload }) => {
                state.openerLoading = false;
                state.openerError = payload || 'Unknown error';
            });
    },
});

export default datasetsSlice.reducer;
