import { PaginatedApiResponse } from '../common/CommonTypes';
import ComputePlansApi from '../computePlans/ComputePlansApi';
import { DatasetStubType } from '../datasets/DatasetsTypes';
import { SerieT } from './SeriesTypes';
import { buildSeries } from './SeriesUtils';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosPromise } from 'axios';

import MetricsApi from '@/modules//metrics/MetricsApi';
import DatasetsApi from '@/modules/datasets/DatasetsApi';
import { MetricType } from '@/modules/metrics/MetricsTypes';
import { TesttupleT } from '@/modules/tasks/TuplesTypes';

import { getAllPagesResults } from '@/libs/request';
import { SearchFilterType } from '@/libs/searchFilter';

interface SeriesState {
    computePlanKey: string;

    series: SerieT[];
    metrics: MetricType[];

    selectedMetricKeys: string[];

    loading: boolean;
    error: string;
}

const initialState: SeriesState = {
    computePlanKey: '',

    series: [],
    metrics: [],

    selectedMetricKeys: [],

    loading: true,
    error: '',
};

export const loadSeries = createAsyncThunk<
    {
        metrics: MetricType[];
        series: SerieT[];
    },
    string,
    { rejectValue: string }
>('series/loadData', async (computePlanKey, thunkAPI) => {
    // load testtuples
    let testtuples: TesttupleT[];
    try {
        testtuples = await getAllPagesResults<TesttupleT, [string]>(
            ComputePlansApi.listComputePlanTesttuples,
            [computePlanKey],
            100
        );
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }

    // load datasets and metrics

    let metrics: MetricType[] = [];
    let datasets: DatasetStubType[] = [];
    if (testtuples.length) {
        const metricKeys: string[] = [];
        const datasetKeys: string[] = [];
        for (const testtuple of testtuples) {
            if (!metricKeys.includes(testtuple.test.objective_key)) {
                metricKeys.push(testtuple.test.objective_key);
            }
            if (!datasetKeys.includes(testtuple.test.data_manager_key)) {
                datasetKeys.push(testtuple.test.data_manager_key);
            }
        }
        const metricSearchFilters = metricKeys.map(
            (key: string): SearchFilterType => ({
                asset: 'objective',
                key: 'key',
                value: key,
            })
        );
        const datasetSearchFilters = datasetKeys.map(
            (key: string): SearchFilterType => ({
                asset: 'dataset',
                key: 'key',
                value: key,
            })
        );
        const promises: [
            AxiosPromise<PaginatedApiResponse<MetricType>>,
            AxiosPromise<PaginatedApiResponse<DatasetStubType>>
        ] = [
            MetricsApi.listMetrics(metricSearchFilters),
            DatasetsApi.listDatasets(datasetSearchFilters),
        ];
        let responses;
        try {
            responses = await Promise.all(promises);
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }

        metrics = responses[0].data.results;
        datasets = responses[1].data.results;
    }

    // build series

    const series = buildSeries(testtuples, datasets, metrics);

    return {
        metrics,
        series,
    };
});

export const seriesSlice = createSlice({
    name: 'series',
    initialState,
    reducers: {
        setSelectedMetricKeys(
            state: SeriesState,
            action: PayloadAction<string[]>
        ) {
            state.selectedMetricKeys = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadSeries.pending, (state, action) => {
                state.computePlanKey = action.meta.arg;
                state.series = [];
                state.metrics = [];
                state.selectedMetricKeys = [];
                state.loading = true;
                state.error = '';
            })
            .addCase(loadSeries.fulfilled, (state, { payload }) => {
                state.series = payload.series;
                state.metrics = payload.metrics;
                state.selectedMetricKeys = payload.metrics.map(
                    (metric) => metric.key
                );
                state.loading = false;
                state.error = '';
            })
            .addCase(loadSeries.rejected, (state, { payload }) => {
                state.series = [];
                state.metrics = [];
                state.selectedMetricKeys = [];
                state.loading = false;
                state.error = payload || 'Unknown error';
            });
    },
});

export const { setSelectedMetricKeys } = seriesSlice.actions;

export default seriesSlice.reducer;
