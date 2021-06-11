import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { DatasetType, DatasetStubType } from './DatasetsTypes';
import DatasetAPI from './DatasetsApi';
import { SearchFilterType } from '@/libs/filterParser';

interface DatasetState {
    datasets: DatasetStubType[];
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

export const listDatasets = createAsyncThunk(
    'datasets/list',
    async (filters: SearchFilterType[], thunkAPI) => {
        try {
            const response = await DatasetAPI.listDatasets(filters);
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const retrieveDataset = createAsyncThunk(
    'datasets/get',
    async (key: string, thunkAPI) => {
        try {
            const response = await DatasetAPI.retrieveDataset(key);
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const retrieveDescription = createAsyncThunk(
    'datasets/description',
    async (descriptionURL: string, thunkAPI) => {
        try {
            const response = await DatasetAPI.retrieveDescription(
                descriptionURL
            );
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

export const retrieveOpener = createAsyncThunk(
    'datasets/opener',
    async (openerURL: string, thunkAPI) => {
        try {
            const response = await DatasetAPI.retrieveOpener(openerURL);
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

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
                state.datasets = payload;
                state.datasetsLoading = false;
                state.datasetsError = '';
            })
            .addCase(listDatasets.rejected, (state, { payload }) => {
                state.datasetsLoading = false;
                state.datasetsError = payload;
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
                state.datasetError = payload;
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
                state.openerError = payload;
            });
    },
});

export default datasetsSlice.reducer;
