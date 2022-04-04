import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { SearchFilterType } from '@/libs/searchFilter';
import * as CommonApi from '@/modules/common/CommonApi';
import { PaginatedApiResponse } from '@/modules/common/CommonTypes';

import * as MetricsAPI from './MetricsApi';
import { MetricType } from './MetricsTypes';

interface MetricState {
    metrics: MetricType[];
    metricsLoading: boolean;
    metricsError: string;
    metricsCount: number;

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
    metricsCount: 0,

    metric: null,
    metricLoading: true,
    metricError: '',

    description: '',
    descriptionLoading: true,
    descriptionError: '',
};

interface listMetricsArgs {
    filters: SearchFilterType[];
    page: number;
    ordering: string;
    match: string;
}
export const listMetrics = createAsyncThunk<
    PaginatedApiResponse<MetricType>,
    listMetricsArgs,
    { rejectValue: string }
>(
    'metrics/list',
    async ({ filters, page, ordering, match }: listMetricsArgs, thunkAPI) => {
        try {
            const response = await MetricsAPI.listMetrics(
                { searchFilters: filters, page, ordering, match },
                { signal: thunkAPI.signal }
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return thunkAPI.rejectWithValue(error.response?.data);
            } else {
                throw error;
            }
        }
    }
);

export const retrieveMetric = createAsyncThunk<
    MetricType,
    string,
    { rejectValue: string }
>('metrics/get', async (key: string, thunkAPI) => {
    try {
        const response = await MetricsAPI.retrieveMetric(key, {
            signal: thunkAPI.signal,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
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
>('metrics/description', async (descriptionURL: string, thunkAPI) => {
    try {
        const response = await CommonApi.retrieveDescription(descriptionURL, {
            signal: thunkAPI.signal,
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return thunkAPI.rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
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
                state.metrics = payload.results;
                state.metricsLoading = false;
                state.metricsError = '';
                state.metricsCount = payload.count;
            })
            .addCase(listMetrics.rejected, (state, { payload, error }) => {
                if (error.name !== 'AbortError') {
                    state.metrics = [];
                    state.metricsCount = 0;
                    state.metricsLoading = false;
                    state.metricsError = payload || 'Unknown error';
                }
            })
            .addCase(retrieveMetric.pending, (state) => {
                state.metricLoading = true;
                state.metric = null;
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
