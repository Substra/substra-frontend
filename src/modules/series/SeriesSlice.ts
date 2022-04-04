import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { getAllPages } from '@/modules/common/CommonUtils';
import * as ComputePlansApi from '@/modules/computePlans/ComputePlansApi';
import {
    MELLODDY_LARGE5_NODE_IDS,
    MELLODDY_SMALL5_NODE_IDS,
} from '@/modules/nodes/NodesUtils';
import { PerformanceType } from '@/modules/perf/PerformancesTypes';

import { SerieT } from './SeriesTypes';
import { buildAverageSerie, buildSeries } from './SeriesUtils';

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
    let cpPerformances: PerformanceType[];

    try {
        const pageSize = 100;
        cpPerformances = await getAllPages(
            (page) =>
                ComputePlansApi.listComputePlanPerformances(
                    { key: computePlanKey, searchFilters: [], pageSize, page },
                    { signal }
                ),
            pageSize
        );
    } catch (error) {
        if (axios.isAxiosError(error)) {
            return rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }

    // build series
    const series = buildSeries(cpPerformances, computePlanKey);

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
