import NodesAPI from './NodesApi';
import { NodeInfoType, NodeType } from './NodesTypes';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

declare const API_URL: string;

interface NodesState {
    nodes: NodeType[];
    nodesLoading: boolean;
    nodesError: string;

    info: NodeInfoType;
    infoLoading: boolean;
    infoError: string;
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

export const nodesSlice = createSlice({
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
            });
    },
});

export default nodesSlice.reducer;
