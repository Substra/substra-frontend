import NodesAPI from './NodesApi';
import { NodeInfoType, NodeType } from './NodesTypes';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

declare const API_URL: string;

interface NodesState {
    nodes: NodeType[];
    nodesLoading: boolean;
    nodesError: string;
    currentNodeID: string;

    info: NodeInfoType;
    infoLoading: boolean;
    infoError: string;
}

const initialState: NodesState = {
    nodes: [],
    nodesLoading: false,
    nodesError: '',
    currentNodeID: 'Owkin Connect',

    info: {
        host: API_URL,
        channel: '',
        config: {
            model_export_enabled: false,
        },
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
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const retrieveInfo = createAsyncThunk<
    NodeInfoType,
    void,
    { rejectValue: string }
>('nodes/info', async (_, thunkAPI) => {
    try {
        const response = await NodesAPI.retrieveInfo();
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
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
                const currentNode = payload.find((node) => node.is_current);
                if (currentNode) {
                    state.currentNodeID = currentNode.id;
                }
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
                state.info = initialState.info;
            });
    },
});

export default nodesSlice.reducer;
