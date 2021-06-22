import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import CommonApi from '@/modules/common/CommonApi';

import { MetricType } from './MetricsTypes';
import MetricsAPI from './MetricsApi';
import { SearchFilterType } from '@/libs/searchFilter';

interface MetricState {
    metrics: MetricType[];
    metricsLoading: boolean;
    metricsError: string;

    metric: MetricType | null;
    metricLoading: boolean;
    metricError: string;

    description: string;
    descriptionLoading: boolean;
    descriptionError: string;
}

const initialState: MetricState = {
    metrics: [],
    metricsLoading: true,
    metricsError: '',

    metric: null,
    metricLoading: true,
    metricError: '',

    description: '',
    descriptionLoading: true,
    descriptionError: '',
};

export const listMetrics = createAsyncThunk<
    MetricType[],
    SearchFilterType[],
    { rejectValue: string }
>('metrics/list', async (filters: SearchFilterType[], thunkAPI) => {
    try {
        const response = await MetricsAPI.listMetrics(filters);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const retrieveMetric = createAsyncThunk<
    MetricType,
    string,
    { rejectValue: string }
>('metrics/get', async (key: string, thunkAPI) => {
    try {
        const response = await MetricsAPI.retrieveMetric(key);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const retrieveDescription = createAsyncThunk<
    string,
    string,
    { rejectValue: string }
>('metrics/description', async (descriptionURL: string, thunkAPI) => {
    try {
        const response = await CommonApi.retrieveDescription(descriptionURL);
        return response.data;
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
});

export const metricsSlice = createSlice({
    name: 'metric',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(listMetrics.pending, (state) => {
                state.metricsLoading = true;
                state.metricsError = '';
            })
            .addCase(listMetrics.fulfilled, (state, { payload }) => {
                state.metrics = payload;
                state.metricsLoading = false;
                state.metricsError = '';
            })
            .addCase(listMetrics.rejected, (state, { payload }) => {
                state.metricsLoading = false;
                state.metricsError = payload || 'Unknown error';
            })
            .addCase(retrieveMetric.pending, (state) => {
                state.metricLoading = true;
                state.metricError = '';
            })
            .addCase(retrieveMetric.fulfilled, (state, { payload }) => {
                state.metricLoading = false;
                state.metricError = '';
                state.metric = payload;
            })
            .addCase(retrieveMetric.rejected, (state, { payload }) => {
                state.metricLoading = false;
                state.metricError = payload || 'Unknown error';
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
            });
    },
});

export default metricsSlice.reducer;
