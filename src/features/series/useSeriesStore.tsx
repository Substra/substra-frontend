import axios from 'axios';
import { create } from 'zustand';

import { listComputePlanPerformances } from '@/api/ComputePlansApi';
import {
    ComputePlanStatisticsT,
    PerformanceT,
} from '@/types/PerformancesTypes';
import { SerieT } from '@/types/SeriesTypes';

import { buildSeries } from './SeriesUtils';

type SeriesStateT = {
    series: SerieT[];
    fetchingSeries: boolean;
    fetchSeries: (computePlanKeyOrKeys: string | string[]) => void;
};

const getComputePlanSeries = async (
    computePlanKey: string,
    signal: AbortSignal
): Promise<SerieT[] | null> => {
    let cpStats: ComputePlanStatisticsT;
    let cpPerformances: PerformanceT[];

    try {
        const response = await listComputePlanPerformances(
            {
                key: computePlanKey,
                pageSize: 0,
                page: 1,
            },
            { signal }
        );
        cpPerformances = response.data.results;
        cpStats = response.data.compute_plan_statistics;
    } catch (error) {
        if (axios.isCancel(error)) {
            // do nothing, the call has been canceled voluntarily
        } else {
            console.warn(error);
        }
        return null;
    }

    // build series
    const series = buildSeries(cpPerformances, computePlanKey, cpStats);

    return series;
};

let fetchController: AbortController | undefined;

const useSeriesStore = create<SeriesStateT>((set, get) => ({
    series: [],
    fetchingSeries: true,
    fetchSeries: async (computePlanKeyorKeys: string | string[]) => {
        // abort previous call
        if (fetchController) {
            fetchController.abort();
        }

        fetchController = new AbortController();

        // if computePlanKeyOrKeys is a string, make it a list
        const computePlanKeys =
            typeof computePlanKeyorKeys === 'string'
                ? [computePlanKeyorKeys]
                : computePlanKeyorKeys;

        // load series for each compute plan
        set({ fetchingSeries: true });
        for (const computePlanKey of computePlanKeys) {
            const computePlanSeries = await getComputePlanSeries(
                computePlanKey,
                fetchController.signal
            );

            if (computePlanSeries) {
                set({
                    series: [...get().series, ...computePlanSeries],
                });
            }
        }

        set({ fetchingSeries: false });
    },
}));

export default useSeriesStore;
