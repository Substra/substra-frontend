import { PaginatedApiResponse } from '../common/CommonTypes';
import ComputePlansApi from '../computePlans/ComputePlansApi';
import { DatasetStubType } from '../datasets/DatasetsTypes';
import { SerieT } from './SeriesTypes';
import { buildSeries } from './SeriesUtils';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosPromise } from 'axios';

import MetricsApi from '@/modules//metrics/MetricsApi';
import DatasetsApi from '@/modules/datasets/DatasetsApi';
import { MetricType } from '@/modules/metrics/MetricsTypes';
import { TesttupleStub } from '@/modules/tasks/TuplesTypes';

import { getAllPagesResults } from '@/libs/request';
import { SearchFilterType } from '@/libs/searchFilter';

interface SeriesState {
    series: SerieT[];
    loading: boolean;
    error: string;
}

const initialState: SeriesState = {
    series: [],
    loading: true,
    error: '',
};

const getComputePlanSeries = async (
    computePlanKey: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rejectWithValue: (value: string) => any
): Promise<SerieT[]> => {
    let testtuples: TesttupleStub[];

    try {
        testtuples = await getAllPagesResults<
            TesttupleStub,
            [string, SearchFilterType[]]
        >(ComputePlansApi.listComputePlanTesttuples, [computePlanKey, []], 100);
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }

    // load datasets and metrics

    let metrics: MetricType[] = [];
    let datasets: DatasetStubType[] = [];
    if (testtuples.length) {
        const metricKeys: string[] = [];
        const datasetKeys: string[] = [];
        for (const testtuple of testtuples) {
            for (const metricKey of testtuple.test.metric_keys) {
                if (!metricKeys.includes(metricKey)) {
                    metricKeys.push(metricKey);
                }
            }
            if (!datasetKeys.includes(testtuple.test.data_manager_key)) {
                datasetKeys.push(testtuple.test.data_manager_key);
            }
        }
        const metricSearchFilters = metricKeys.map(
            (key: string): SearchFilterType => ({
                asset: 'metric',
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
        } catch (error) {
            if (axios.isAxiosError(error)) {
                return rejectWithValue(error.response?.data);
            } else {
                throw error;
            }
        }

        metrics = responses[0].data.results;
        datasets = responses[1].data.results;
    }

    // build series

    return buildSeries(testtuples, datasets, metrics);
};

export const loadSeries = createAsyncThunk<
    SerieT[],
    string | string[],
    { rejectValue: string }
>('series/loadComputePlansSeries', async (computePlanKeyOrKeys, thunkAPI) => {
    // if computePlanKeyOrKeys is a string, make it a list
    const computePlanKeys =
        typeof computePlanKeyOrKeys === 'string'
            ? [computePlanKeyOrKeys]
            : computePlanKeyOrKeys;

    // load series for each compute plan
    let series: SerieT[] = [];
    for (const computePlanKey of computePlanKeys) {
        const computePlanSeries = await getComputePlanSeries(
            computePlanKey,
            thunkAPI.rejectWithValue
        );

        series = [...series, ...computePlanSeries];
    }

    return series;
});

export const seriesSlice = createSlice({
    name: 'series',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(loadSeries.pending, (state) => {
                state.series = [];
                state.loading = true;
                state.error = '';
            })
            .addCase(loadSeries.fulfilled, (state, { payload }) => {
                state.series = payload;
                state.loading = false;
                state.error = '';
            })
            .addCase(loadSeries.rejected, (state, { payload }) => {
                state.series = [];
                state.loading = false;
                state.error = payload || 'Unknown error';
            });
    },
});

export default seriesSlice.reducer;
