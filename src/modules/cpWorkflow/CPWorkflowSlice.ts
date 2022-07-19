import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import * as CPWorkflowApi from '@/modules/cpWorkflow/CPWorkflowApi';
import { TaskGraphT } from '@/modules/cpWorkflow/CPWorkflowTypes';

type WorkflowGraphStateT = {
    graph: TaskGraphT;
    loading: boolean;
    error: string;
};

const emptyGraph = {
    tasks: [],
    edges: [],
};

const initialState: WorkflowGraphStateT = {
    graph: emptyGraph,
    loading: false,
    error: '',
};

export const retrieveCPWorkflowGraph = createAsyncThunk<
    TaskGraphT,
    string,
    { rejectValue: string }
>('cpWorkflow/get', async (computePlanKey, thunkAPI) => {
    try {
        const response = await CPWorkflowApi.retrieveCPWorkflowGraph(
            computePlanKey,
            {
                signal: thunkAPI.signal,
            }
        );
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            const data = error.response?.data;
            return thunkAPI.rejectWithValue(data?.message ?? data);
        } else {
            throw error;
        }
    }
});

const cpWorkflowSlice = createSlice({
    name: 'cpWorkflow',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(retrieveCPWorkflowGraph.pending, (state) => {
                state.graph = emptyGraph;
                state.loading = true;
                state.error = '';
            })
            .addCase(
                retrieveCPWorkflowGraph.fulfilled,
                (state, { payload }) => {
                    state.graph = payload;
                    state.loading = false;
                    state.error = '';
                }
            )
            .addCase(
                retrieveCPWorkflowGraph.rejected,
                (state, { payload, error }) => {
                    if (error.name !== 'AbortError') {
                        state.graph = emptyGraph;
                        state.loading = false;
                        state.error = payload || 'Unknown error';
                    }
                }
            );
    },
});

export default cpWorkflowSlice.reducer;
