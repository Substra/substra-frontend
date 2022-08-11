import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import * as CommonApi from '@/modules/common/CommonApi';
import { PaginatedApiResponseT } from '@/modules/common/CommonTypes';

import * as AlgosApi from './AlgosApi';
import { AlgoT } from './AlgosTypes';

type AlgoStateT = {
    algos: AlgoT[];
    algosCount: number;
    algosLoading: boolean;
    algosError: string;

    algo: AlgoT | null;
    algoLoading: boolean;
    algoError: string;

    algoUpdating: boolean;
    algoUpdateError: string;

    description: string;
    descriptionLoading: boolean;
    descriptionError: string;
};

const initialState: AlgoStateT = {
    algos: [],
    algosCount: 0,
    algosLoading: true,
    algosError: '',

    algo: null,
    algoLoading: true,
    algoError: '',

    algoUpdating: false,
    algoUpdateError: '',

    description: '',
    descriptionLoading: true,
    descriptionError: '',
};

type ListAlgosProps = {
    page?: number;
    ordering?: string;
    match?: string;
} & {
    [param: string]: unknown;
};

export const listAlgos = createAsyncThunk<
    PaginatedApiResponseT<AlgoT>,
    ListAlgosProps,
    { rejectValue: string }
>('algos/listAlgos', async (params: ListAlgosProps, thunkAPI) => {
    try {
        const response = await AlgosApi.listAlgos(params, {
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
>('algos/description', async (descriptionURL: string, thunkAPI) => {
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

export const updateAlgo = createAsyncThunk<
    AlgoT,
    { key: string; name: string },
    { rejectValue: string }
>('algos/update', async ({ key, name }, thunkAPI) => {
    try {
        await AlgosApi.updateAlgo(
            key,
            { name },
            {
                signal: thunkAPI.signal,
            }
        );
        const response = await AlgosApi.retrieveAlgo(key, {});
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

const algosSlice = createSlice({
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
            })
            .addCase(updateAlgo.pending, (state) => {
                state.algoUpdating = true;
                state.algoUpdateError = '';
            })
            .addCase(updateAlgo.fulfilled, (state, { payload }) => {
                state.algo = payload;
                state.algoUpdating = false;
                state.algoUpdateError = '';
                // update name in list
                state.algos = state.algos.map((algo) =>
                    algo.key === payload.key ? payload : algo
                );
            })
            .addCase(updateAlgo.rejected, (state, { payload }) => {
                state.algoUpdating = false;
                state.algoUpdateError = payload || 'unknown error';
            });
    },
});

export default algosSlice.reducer;
