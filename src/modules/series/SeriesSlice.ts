import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';

import { getAllPages } from '@/modules/common/CommonUtils';
import * as ComputePlansApi from '@/modules/computePlans/ComputePlansApi';
import {
    ComputePlanStatisticsT,
    PerformanceT,
} from '@/modules/perf/PerformancesTypes';

import { SerieT } from './SeriesTypes';
import { buildSeries } from './SeriesUtils';

type SeriesStateT = {
    series: SerieT[];
    loading: boolean;
    error: string;
};

const initialState: SeriesStateT = {
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
    let cpStats: ComputePlanStatisticsT;
    let cpPerformances: PerformanceT[];

    try {
        const response = await ComputePlansApi.listComputePlanPerformances(
            {
                key: computePlanKey,
                pageSize: 0,
                page: 1,
            },
            { signal }
        );
        cpStats = response.data.compute_plan_statistics;
    } catch (error) {
        if (error instanceof AxiosError) {
            return rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }

    try {
        const pageSize = 100;
        cpPerformances = await getAllPages(
            (page) =>
                ComputePlansApi.listComputePlanPerformances(
                    { key: computePlanKey, pageSize, page },
                    { signal }
                ),
            pageSize
        );
    } catch (error) {
        if (error instanceof AxiosError) {
            return rejectWithValue(error.response?.data);
        } else {
            throw error;
        }
    }

    // build series
    const series = buildSeries(cpPerformances, computePlanKey, cpStats);

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

const seriesSlice = createSlice({
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
            .addCase(loadSeries.rejected, (state, { payload, error }) => {
                if (error.name !== 'AbortError') {
                    state.series = [];
                    state.loading = false;
                    state.error = payload || 'Unknown error';
                }
            });
    },
});

export default seriesSlice.reducer;
