import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { NodeType } from './NodesTypes';
import NodesAPI from './NodesApi';

interface NodesState {
    nodes: NodeType[];
    nodesLoading: boolean;
    nodesError: string;
    currentNodeID: string;
}

const initialState: NodesState = {
    nodes: [],
    nodesLoading: false,
    nodesError: '',
    currentNodeID: 'Owkin Connect',
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
            });
    },
});

export default nodesSlice.reducer;
