import { DatasetStubType } from '../datasets/DatasetsTypes';
import { SerieT } from './SeriesTypes';
import { buildIndex, buildSeries } from './SeriesUtils';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AxiosPromise } from 'axios';

import MetricsApi from '@/modules//metrics/MetricsApi';
import DatasetsApi from '@/modules/datasets/DatasetsApi';
import { MetricType } from '@/modules/metrics/MetricsTypes';
import TasksApi from '@/modules/tasks/TasksApi';
import {
    CompositeTraintupleT,
    TesttupleT,
    TraintupleT,
} from '@/modules/tasks/TuplesTypes';

import { SearchFilterType } from '@/libs/searchFilter';

interface SeriesState {
    computePlanKey: string;

    metrics: MetricType[];
    metricsLoading: boolean;
    metricsError: string;

    selectedMetricKeys: string[];

    testtuples: TesttupleT[];

    series: SerieT[];
    seriesLoading: boolean;
    seriesError: string;
}

const initialState: SeriesState = {
    computePlanKey: '',

    metrics: [],
    metricsLoading: true,
    metricsError: '',

    selectedMetricKeys: [],

    testtuples: [],

    series: [],
    seriesLoading: false,
    seriesError: '',
};

export const listMetrics = createAsyncThunk<
    { metrics: MetricType[]; testtuples: TesttupleT[] },
    string,
    { rejectValue: string }
>('series/listMetrics', async (computePlanKey, thunkAPI) => {
    let testtuplesResponse;
    try {
        testtuplesResponse = await TasksApi.listTesttuples([
            {
                asset: 'testtuple',
                key: 'compute_plan_key',
                value: computePlanKey,
            },
        ]);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }

    const testtuples = testtuplesResponse.data;

    // deduplicate metrics keys
    const metricKeys = new Set(
        testtuples.map((testtuple) => testtuple.objective.key)
    );

    // load all the metrics used in the compute plan
    const metricsSearchFilter: SearchFilterType[] = [];
    for (const metricKey of metricKeys) {
        metricsSearchFilter.push({
            asset: 'objective',
            key: 'key',
            value: metricKey,
        });
    }
    let metricsResponse;
    try {
        metricsResponse = await MetricsApi.listMetrics(metricsSearchFilter);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }
    const metrics = metricsResponse.data;

    return {
        metrics,
        testtuples,
    };
});

function emptyAxiosPromise<Type>(): AxiosPromise<Type[]> {
    return new Promise((resolve) => {
        resolve({
            data: [],
            status: 0,
            statusText: 'foo',
            headers: {},
            config: {},
        });
    });
}

export const loadSeries = createAsyncThunk<
    SerieT[],
    string[],
    { rejectValue: string }
>('series/loadSeries', async (metricKeys, thunkAPI) => {
    const {
        series: { testtuples, metrics },
    } = thunkAPI.getState() as { series: SeriesState };
    const selectedTesttuples = testtuples.filter((testtuple) =>
        metricKeys.includes(testtuple.objective.key)
    );

    // load datasets, traintuples and composite traintuples
    // build filters
    const datasetFilters: SearchFilterType[] = [];
    const datasetKeys = new Set(
        selectedTesttuples.map((testtuple) => testtuple.dataset.key)
    );
    for (const datasetKey of datasetKeys) {
        datasetFilters.push({
            asset: 'dataset',
            key: 'key',
            value: datasetKey,
        });
    }
    const traintupleFilters: SearchFilterType[] = selectedTesttuples
        .filter((testtuple) => testtuple.traintuple_type === 'traintuple')
        .map((testtuple) => ({
            asset: 'traintuple',
            key: 'key',
            value: testtuple.traintuple_key,
        }));
    const compositeTraintupleFilters: SearchFilterType[] = selectedTesttuples
        .filter(
            (testtuple) => testtuple.traintuple_type === 'composite_traintuple'
        )
        .map((testtuple) => ({
            asset: 'composite_traintuple',
            key: 'key',
            value: testtuple.traintuple_key,
        }));

    // actually load assets
    const promises: [
        AxiosPromise<DatasetStubType[]>,
        AxiosPromise<TraintupleT[]>,
        AxiosPromise<CompositeTraintupleT[]>
    ] = [
        DatasetsApi.listDatasets(datasetFilters),
        traintupleFilters.length
            ? TasksApi.listTraintuples(traintupleFilters)
            : emptyAxiosPromise<TraintupleT>(),
        compositeTraintupleFilters.length
            ? TasksApi.listCompositeTraintuples(compositeTraintupleFilters)
            : emptyAxiosPromise<CompositeTraintupleT>(),
    ];
    let responses;
    try {
        responses = await Promise.all(promises);
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data);
    }

    // build indexes
    const metricIndex = buildIndex(metrics);
    const datasetIndex = buildIndex<DatasetStubType>(responses[0].data);
    const traintupleIndex = buildIndex<TraintupleT>(responses[1].data);
    const compositeTraintupleIndex = buildIndex<CompositeTraintupleT>(
        responses[2].data
    );

    // build series from test tasks
    return buildSeries(
        testtuples,
        datasetIndex,
        metricIndex,
        traintupleIndex,
        compositeTraintupleIndex
    );
});

export const seriesSlice = createSlice({
    name: 'series',
    initialState,
    reducers: {
        resetSeries(state: SeriesState, action: PayloadAction<string>) {
            const computePlanKey = action.payload;
            if (state.computePlanKey !== computePlanKey) {
                state.metrics = initialState.metrics;
                state.metricsLoading = initialState.metricsLoading;
                state.metricsError = initialState.metricsError;

                state.testtuples = initialState.testtuples;
            }

            state.series = initialState.series;
            state.seriesLoading = initialState.seriesLoading;
            state.seriesError = initialState.seriesError;

            state.selectedMetricKeys = initialState.selectedMetricKeys;

            state.computePlanKey = computePlanKey;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(listMetrics.pending, (state, action) => {
                state.metrics = [];
                state.testtuples = [];
                state.metricsLoading = true;
                state.metricsError = '';
                state.computePlanKey = action.meta.arg;
            })
            .addCase(listMetrics.fulfilled, (state, { payload }) => {
                state.metrics = payload.metrics;
                state.testtuples = payload.testtuples;
                state.metricsLoading = false;
                state.metricsError = '';
            })
            .addCase(listMetrics.rejected, (state, { payload }) => {
                state.metrics = [];
                state.testtuples = [];
                state.metricsLoading = false;
                state.metricsError = payload || 'Unknown error';
            })
            .addCase(loadSeries.pending, (state, action) => {
                state.series = [];
                state.seriesLoading = true;
                state.seriesError = '';
                state.selectedMetricKeys = action.meta.arg;
            })
            .addCase(loadSeries.fulfilled, (state, { payload }) => {
                state.series = payload;
                state.seriesLoading = false;
                state.seriesError = '';
            })
            .addCase(loadSeries.rejected, (state) => {
                state.series = [];
                state.seriesLoading = false;
                state.seriesError = '';
            });
    },
});

export const { resetSeries } = seriesSlice.actions;

export default seriesSlice.reducer;
