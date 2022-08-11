import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import * as CommonApi from '@/modules/common/CommonApi';
import { PaginatedApiResponseT } from '@/modules/common/CommonTypes';

import * as DatasetAPI from './DatasetsApi';
import { DatasetT, DatasetStubT } from './DatasetsTypes';

type DatasetStateT = {
    datasets: DatasetStubT[];
    datasetsCount: number;
    datasetsLoading: boolean;
    datasetsError: string;

    dataset: DatasetT | null;
    datasetLoading: boolean;
    datasetError: string;

    datasetUpdating: boolean;
    datasetUpdateError: string;

    description: string;
    descriptionLoading: boolean;
    descriptionError: string;

    opener: string;
    openerLoading: boolean;
    openerError: string;
};

const initialState: DatasetStateT = {
    datasets: [],
    datasetsCount: 0,
    datasetsLoading: true,
    datasetsError: '',

    dataset: null,
    datasetLoading: true,
    datasetError: '',

    datasetUpdating: false,
    datasetUpdateError: '',

    description: '',
    descriptionLoading: true,
    descriptionError: '',

    opener: '',
    openerLoading: true,
    openerError: '',
};

type ListDatasetsArgsProps = {
    page?: number;
    ordering?: string;
    match?: string;
} & {
    [param: string]: unknown;
};

export const listDatasets = createAsyncThunk<
    PaginatedApiResponseT<DatasetStubT>,
    ListDatasetsArgsProps,
    { rejectValue: string }
>('datasets/list', async (params: ListDatasetsArgsProps, thunkAPI) => {
    try {
        const response = await DatasetAPI.listDatasets(params, {
            signal: thunkAPI.signal,
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

export const retrieveDataset = createAsyncThunk<
    DatasetT,
    string,
    { rejectValue: string }
>('datasets/get', async (key: string, thunkAPI) => {
    try {
        const response = await DatasetAPI.retrieveDataset(key, {
            signal: thunkAPI.signal,
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
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
        if (error instanceof AxiosError) {
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
        if (error instanceof AxiosError) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

export const updateDataset = createAsyncThunk<
    DatasetT,
    { key: string; name: string },
    { rejectValue: string }
>('datasets/update', async ({ key, name }, thunkAPI) => {
    try {
        await DatasetAPI.updateDataset(
            key,
            { name },
            {
                signal: thunkAPI.signal,
            }
        );
        const response = await DatasetAPI.retrieveDataset(key, {});
        response.data.name = name;
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            const data = error.response?.data;
            let msg;
            if (typeof data === 'object' && data.detail) {
                msg = data.detail;
            } else {
                msg = JSON.stringify(data);
            }
            return thunkAPI.rejectWithValue(msg);
        } else {
            throw error;
        }
    }
});

const datasetsSlice = createSlice({
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
            })
            .addCase(updateDataset.pending, (state) => {
                state.datasetUpdating = true;
                state.datasetUpdateError = '';
            })
            .addCase(updateDataset.fulfilled, (state, { payload }) => {
                state.dataset = payload;
                state.datasetUpdating = false;
                state.datasetUpdateError = '';
            })
            .addCase(updateDataset.rejected, (state, { payload }) => {
                state.datasetUpdating = false;
                state.datasetUpdateError = payload || 'unknown error';
            });
    },
});

export default datasetsSlice.reducer;
