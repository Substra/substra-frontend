import { SerieT } from './SeriesTypes';
import { buildAverageSerie, buildSeries } from './SeriesUtils';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosPromise } from 'axios';

import * as MetricsApi from '@/modules//metrics/MetricsApi';
import { PaginatedApiResponse } from '@/modules/common/CommonTypes';
import * as ComputePlansApi from '@/modules/computePlans/ComputePlansApi';
import * as DatasetsApi from '@/modules/datasets/DatasetsApi';
import { DatasetStubType } from '@/modules/datasets/DatasetsTypes';
import { MetricType } from '@/modules/metrics/MetricsTypes';
import {
    MELLODDY_LARGE5_NODE_IDS,
    MELLODDY_SMALL5_NODE_IDS,
} from '@/modules/nodes/NodesUtils';
import { TesttupleStub } from '@/modules/tasks/TuplesTypes';

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
    rejectWithValue: (value: string) => any,
    signal: AbortSignal
): Promise<SerieT[]> => {
    let testtuples: TesttupleStub[];

    try {
        const pageSize = 100;
        const firstPageResponse =
            await ComputePlansApi.listComputePlanTesttuples(
                { key: computePlanKey, searchFilters: [], pageSize, page: 1 },
                { signal }
            );
        const lastPage = Math.ceil(firstPageResponse.data.count / pageSize);
        testtuples = firstPageResponse.data.results;

        for (let page = 2; page <= lastPage; page++) {
            const pageResponse =
                await ComputePlansApi.listComputePlanTesttuples(
                    { key: computePlanKey, searchFilters: [], pageSize, page },
                    { signal }
                );
            testtuples = [...testtuples, ...pageResponse.data.results];
        }
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
            MetricsApi.listMetrics(
                { searchFilters: metricSearchFilters },
                { signal }
            ),
            DatasetsApi.listDatasets(
                { searchFilters: datasetSearchFilters },
                { signal }
            ),
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

    const series = buildSeries(testtuples, datasets, metrics);

    if (MELLODDY) {
        const melloddySeries: SerieT[] = [];

        const metricNames = new Set(
            series.map((serie) => serie.metricName.toLowerCase())
        );
        for (const metricName of metricNames) {
            const sameMetricSeries = series.filter(
                (serie) => serie.metricName.toLowerCase() === metricName
            );

            // small5_average
            const small5AverageSerie = buildAverageSerie(
                sameMetricSeries.filter((serie) =>
                    MELLODDY_SMALL5_NODE_IDS.includes(serie.worker)
                ),
                'small5_average'
            );
            if (small5AverageSerie) {
                melloddySeries.push({
                    ...small5AverageSerie,
                    computePlanKey,
                    metricName,
                });
            }

            // large5_average
            const large5AverageSerie = buildAverageSerie(
                sameMetricSeries.filter((serie) =>
                    MELLODDY_LARGE5_NODE_IDS.includes(serie.worker)
                ),
                'large5_average'
            );
            if (large5AverageSerie) {
                melloddySeries.push({
                    ...large5AverageSerie,
                    computePlanKey,
                    metricName,
                });
            }

            // pharma_average
            const pharmaAverageSerie = buildAverageSerie(
                sameMetricSeries.filter(
                    (serie) =>
                        MELLODDY_LARGE5_NODE_IDS.includes(serie.worker) ||
                        MELLODDY_SMALL5_NODE_IDS.includes(serie.worker)
                ),
                'pharma_average'
            );
            if (pharmaAverageSerie) {
                melloddySeries.push({
                    ...pharmaAverageSerie,
                    computePlanKey,
                    metricName,
                });
            }

            // average
            const averageSerie = buildAverageSerie(sameMetricSeries, 'average');
            if (averageSerie) {
                melloddySeries.push({
                    ...averageSerie,
                    computePlanKey,
                    metricName,
                });
            }
        }

        return [...series, ...melloddySeries];
    }
    return series;
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
            thunkAPI.rejectWithValue,
            thunkAPI.signal
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
