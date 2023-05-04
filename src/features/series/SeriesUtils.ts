import { v4 as uuidv4 } from 'uuid';

import { compareOrganizations } from '@/features/organizations/OrganizationsUtils';
import { OrganizationT } from '@/types/OrganizationsTypes';
import {
    ComputePlanStatisticsT,
    PerformanceT,
} from '@/types/PerformancesTypes';
import {
    PointT,
    SerieFeaturesT,
    SerieRankDataT,
    SerieT,
} from '@/types/SeriesTypes';

function buildSerieFeatures(
    performance: PerformanceT,
    computePlanKey: string
): SerieFeaturesT {
    return {
        functionKey: performance.compute_task.function_key,
        worker: performance.compute_task.worker,
        metricKey: performance.metric.key,
        metricName: performance.metric.name,
        identifier: performance.identifier,
        computePlanKey,
    };
}

function areSeriesEqual(sf1: SerieFeaturesT, sf2: SerieFeaturesT): boolean {
    return (
        sf1.functionKey === sf2.functionKey &&
        sf1.worker === sf2.worker &&
        sf1.metricKey === sf2.metricKey &&
        sf1.identifier === sf2.identifier
    );
}

function findSerie(
    series: SerieT[],
    serieFeatures: SerieFeaturesT
): SerieT | null {
    for (const serie of series) {
        if (areSeriesEqual(serie, serieFeatures)) {
            return serie;
        }
    }
    return null;
}

function getRoundAsNumber(str: string | null): number {
    /**
     * round may not be present
     * round is stored as string in the db
     */
    try {
        if (typeof str === 'string') {
            return parseInt(str);
        } else return -1;
    } catch {
        return -1;
    }
}

export function buildSeries(
    cpPerformances: PerformanceT[],
    computePlanKey: string,
    cpStats: ComputePlanStatisticsT
): SerieT[] {
    // create series from test tasks
    const series: SerieT[] = [];

    for (const performance of cpPerformances) {
        const point: PointT = {
            rank: performance.compute_task.rank,
            perf: performance.perf,
            testTaskKey: performance.compute_task.key,
            round: getRoundAsNumber(performance.compute_task.round_idx),
        };

        const serieFeatures = buildSerieFeatures(performance, computePlanKey);

        const serie = findSerie(series, serieFeatures);
        if (serie) {
            serie.points.push(point);
            if (point.perf !== null) {
                serie.maxRankWithPerf = Math.max(
                    serie.maxRankWithPerf,
                    point.rank
                );
                serie.maxRoundWithPerf = Math.max(
                    serie.maxRoundWithPerf,
                    point.round
                );
            }
        } else {
            series.push({
                // The couple (computePlanKey, id) should be unique
                // id is an incremented number
                id: uuidv4(),
                points: [point],
                maxRank: Math.max(0, ...cpStats.compute_tasks_distinct_ranks),
                maxRankWithPerf: point.perf !== null ? point.rank : 0,
                maxRound: Math.max(0, ...cpStats.compute_tasks_distinct_rounds),
                maxRoundWithPerf: point.perf !== null ? point.round : 0,
                ...serieFeatures,
            });
        }
    }

    return series;
}

export function buildSeriesGroups(series: SerieT[]): SerieT[][] {
    const groups = [];

    const seriesGroupings = new Set(
        series.map((serie) =>
            JSON.stringify({
                identifier: serie.identifier.toLowerCase(),
            })
        )
    );
    for (const seriesGrouping of seriesGroupings) {
        const { identifier } = JSON.parse(seriesGrouping);
        const metricGroup = series.filter(
            (serie) => serie.identifier.toLowerCase() === identifier
        );

        groups.push(metricGroup);
    }

    return groups;
}

export const getSeriesOrganizations = (series: SerieT[]): OrganizationT[] => {
    const organizations: string[] = [];
    for (const serie of series) {
        if (!organizations.includes(serie.worker)) {
            organizations.push(serie.worker);
        }
    }
    return organizations.map((organization) => ({
        id: organization,
        is_current: false,
    }));
};

export const getMaxRank = (series: SerieT[]): number => {
    return Math.max(0, ...series.map((s) => s.maxRank));
};

export const getMaxRankWithPerf = (series: SerieT[]): number => {
    return Math.max(0, ...series.map((s) => s.maxRankWithPerf));
};

export const getMaxRound = (series: SerieT[]): number => {
    return Math.max(0, ...series.map((s) => s.maxRound));
};

export const getMaxRoundWithPerf = (series: SerieT[]): number => {
    return Math.max(0, ...series.map((s) => s.maxRoundWithPerf));
};

export const compareSeries = <T extends { id: string }>(
    a: T,
    b: T
): -1 | 0 | 1 => {
    if (a.id === b.id) {
        return 0;
    } else if (a.id < b.id) {
        return -1;
    } else {
        return 1;
    }
};

export const compareSerieRankData = (
    a: SerieRankDataT,
    b: SerieRankDataT
): -1 | 0 | 1 => {
    const organizationsRes = compareOrganizations(a.worker, b.worker);
    if (organizationsRes !== 0) {
        return organizationsRes;
    }
    return compareSeries(a, b);
};
