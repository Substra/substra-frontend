import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { DatasetType } from './DatasetsTypes';
import DatasetAPI from './DatasetsApi';

interface DatasetState {
    datasets: DatasetType[];
    datasetsLoading: boolean;
    datasetsError: string;
}

const initialState: DatasetState = {
    datasets: [],
    datasetsLoading: true,
    datasetsError: '',
};

export const listDatasets = createAsyncThunk(
    'datasets/list',
    async (_, thunkAPI) => {
        try {
            const response = await DatasetAPI.listDatasets();
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
            });
    },
});

export default datasetsSlice.reducer;
