import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import * as NodesAPI from './NodesApi';
import { NodeInfoType, NodeType } from './NodesTypes';

interface NodesState {
    nodes: NodeType[];
    nodesLoading: boolean;
    nodesError: string;

    info: NodeInfoType;
    infoLoading: boolean;
    infoError: string;

    metadata: string[];
    metadataLoading: boolean;
    metadataError: string;
}

const initialState: NodesState = {
    nodes: [],
    nodesLoading: false,
    nodesError: '',

    info: {
        host: API_URL,
        node_id: '',
        config: {},
    },
    infoLoading: false,
    infoError: '',

    metadata: [],
    metadataLoading: true,
    metadataError: '',
};

export const listNodes = createAsyncThunk<
    NodeType[],
    void,
    { rejectValue: string }
>('nodes/list', async (_, thunkAPI) => {
    try {
        const response = await NodesAPI.listNodes();
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

export const retrieveInfo = createAsyncThunk<
    NodeInfoType,
    boolean,
    { rejectValue: string }
>('nodes/info', async (withCredentials, thunkAPI) => {
    try {
        const response = await NodesAPI.retrieveInfo(withCredentials);
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }
});

export const listMetadata = createAsyncThunk<
    string[],
    void,
    { rejectValue: string }
>('nodes/metadata', async (_, thunkAPI) => {
    try {
        const response = await NodesAPI.listMetadata();
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
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
            .addCase(listNodes.pending, (state) => {
                state.nodesLoading = true;
                state.nodesError = '';
            })
            .addCase(listNodes.fulfilled, (state, { payload }) => {
                state.nodesLoading = false;
                state.nodesError = '';
                state.nodes = payload;
            })
            .addCase(listNodes.rejected, (state, { payload }) => {
                state.nodes = [];
                state.nodesLoading = false;
                state.nodesError = payload || 'Unknown error';
            })
            .addCase(retrieveInfo.pending, (state) => {
                state.infoLoading = true;
                state.infoError = '';
            })
            .addCase(retrieveInfo.fulfilled, (state, { payload }) => {
                state.infoLoading = false;
                state.infoError = '';
                state.info = payload;
            })
            .addCase(retrieveInfo.rejected, (state, { payload }) => {
                state.infoLoading = false;
                state.infoError = payload || 'Unknown error';
            })
            .addCase('USERS_LOGOUT/fulfilled', (state) => {
                state.info.version = undefined;
                state.info.channel = undefined;
                state.info.config.model_export_enabled = undefined;
            })
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
