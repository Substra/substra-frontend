import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import * as MetadataApi from './MetadataApi';

interface NodesState {
    metadata: string[];
    metadataLoading: boolean;
    metadataError: string;
}

const initialState: NodesState = {
    metadata: [],
    metadataLoading: true,
    metadataError: '',
};

export const listMetadata = createAsyncThunk<
    string[],
    void,
    { rejectValue: string }
>('nodes/metadata', async (_, thunkAPI) => {
    try {
        const response = await MetadataApi.listMetadata();
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

const nodesSlice = createSlice({
    name: 'nodes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listMetadata.pending, (state) => {
                state.metadata = [];
                state.metadataLoading = true;
                state.metadataError = '';
            })
            .addCase(listMetadata.fulfilled, (state, { payload }) => {
                state.metadata = payload;
                state.metadataLoading = false;
                state.metadataError = '';
            })
            .addCase(listMetadata.rejected, (state, { payload }) => {
                state.metadata = [];
                state.metadataLoading = false;
                state.metadataError = payload || 'Unknown error';
            });
    },
});

export default nodesSlice.reducer;
