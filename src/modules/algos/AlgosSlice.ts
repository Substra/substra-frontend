import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import * as CommonApi from '@/modules/common/CommonApi';
import { PaginatedApiResponseT } from '@/modules/common/CommonTypes';

import * as FunctionsApi from './FunctionsApi';
import { FunctionT } from './FunctionsTypes';

type FunctionStateT = {
    functions: FunctionT[];
    functionsCount: number;
    functionsLoading: boolean;
    functionsError: string;

    function: FunctionT | null;
    functionLoading: boolean;
    functionError: string;

    functionUpdating: boolean;
    functionUpdateError: string;

    description: string;
    descriptionLoading: boolean;
    descriptionError: string;
};

const initialState: FunctionStateT = {
    functions: [],
    functionsCount: 0,
    functionsLoading: true,
    functionsError: '',

    function: null,
    functionLoading: true,
    functionError: '',

    functionUpdating: false,
    functionUpdateError: '',

    description: '',
    descriptionLoading: true,
    descriptionError: '',
};

type ListFunctionsProps = {
    page?: number;
    ordering?: string;
    match?: string;
} & {
    [param: string]: unknown;
};

export const listFunctions = createAsyncThunk<
    PaginatedApiResponseT<FunctionT>,
    ListFunctionsProps,
    { rejectValue: string }
>('functions/listFunctions', async (params: ListFunctionsProps, thunkAPI) => {
    try {
        const response = await FunctionsApi.listFunctions(params, {
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

export const retrieveFunction = createAsyncThunk<
    FunctionT,
    string,
    { rejectValue: string }
>('functions/get', async (key: string, thunkAPI) => {
    try {
        const response = await FunctionsApi.retrieveFunction(key, {
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
>('functions/description', async (descriptionURL: string, thunkAPI) => {
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

export const updateFunction = createAsyncThunk<
    FunctionT,
    { key: string; name: string },
    { rejectValue: string }
>('functions/update', async ({ key, name }, thunkAPI) => {
    try {
        await FunctionsApi.updateFunction(
            key,
            { name },
            {
                signal: thunkAPI.signal,
            }
        );
        const response = await FunctionsApi.retrieveFunction(key, {});
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

const functionsSlice = createSlice({
    name: 'function',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listFunctions.pending, (state) => {
                state.functionsLoading = true;
                state.functionsError = '';
            })
            .addCase(listFunctions.fulfilled, (state, { payload }) => {
                state.functions = payload.results;
                state.functionsCount = payload.count;
                state.functionsLoading = false;
                state.functionsError = '';
            })
            .addCase(listFunctions.rejected, (state, { payload, error }) => {
                if (error.name !== 'AbortError') {
                    state.functions = [];
                    state.functionsCount = 0;
                    state.functionsLoading = false;
                    state.functionsError = payload || 'Unknown error';
                }
            })
            .addCase(retrieveFunction.pending, (state) => {
                state.functionLoading = true;
                state.function = null;
                state.functionError = '';
            })
            .addCase(retrieveFunction.fulfilled, (state, { payload }) => {
                state.functionLoading = false;
                state.functionError = '';
                state.function = payload;
            })
            .addCase(retrieveFunction.rejected, (state, { payload }) => {
                state.functionLoading = false;
                state.functionError = payload || 'Unknown error';
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
            .addCase(updateFunction.pending, (state) => {
                state.functionUpdating = true;
                state.functionUpdateError = '';
            })
            .addCase(updateFunction.fulfilled, (state, { payload }) => {
                state.function = payload;
                state.functionUpdating = false;
                state.functionUpdateError = '';
                // update name in list
                state.functions = state.functions.map((function) =>
                    function.key === payload.key ? payload : function
                );
            })
            .addCase(updateFunction.rejected, (state, { payload }) => {
                state.functionUpdating = false;
                state.functionUpdateError = payload || 'unknown error';
            });
    },
});

export default functionsSlice.reducer;
