import { v4 as uuidv4 } from 'uuid';

import { areSetEqual } from '@/libs/utils';
import { NodeType } from '@/modules/nodes/NodesTypes';
import { compareNodes } from '@/modules/nodes/NodesUtils';
import { PerformanceType } from '@/modules/perf/PerformancesTypes';

import {
    DataPoint,
    PointT,
    SerieFeaturesT,
    SerieRankData,
    SerieT,
} from './SeriesTypes';

function buildSerieFeatures(
    performance: PerformanceType,
    computePlanKey: string
): SerieFeaturesT {
    return {
        algoKey: performance.compute_task.algo_key,
        datasetKey: performance.compute_task.data_manager_key,
        dataSampleKeys: performance.compute_task.data_samples,
        worker: performance.compute_task.worker,
        metricKey: performance.metric.key,
        metricName: performance.metric.name,
        computePlanKey,
    };
}

function areSeriesEqual(sf1: SerieFeaturesT, sf2: SerieFeaturesT): boolean {
    return (
        sf1.algoKey === sf2.algoKey &&
        sf1.datasetKey === sf2.datasetKey &&
        sf1.worker === sf2.worker &&
        sf1.metricKey === sf2.metricKey &&
        areSetEqual(new Set(sf1.dataSampleKeys), new Set(sf2.dataSampleKeys))
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

function getEpochOrRoundAsNumber(str: string | null): number {
    /**
     * epoch & round may not be present
     * epoch & round are stored as string in the db
     */
    try {
        if (typeof str === 'string') {
            return parseInt(str);
        } else return -1;
    } catch {
        return -1;
    }
}

function fixEpoch(serie: SerieT) {
    /**
     * MDY testtuples have been registered with faulty epochs numbers.
     * This is because the first and second testtuples are about the same epoch:
     *  - rank 0 is about the beginning of epoch 0
     *  - next rank is about the end of epoch 0
     *
     * Testtuple registration code has been changed but is faulty even after the change.
     * Here are the situations for the first 3 testtuples:
     *  - before 2022-01-26
     *    Rank | Epoch | Correct Epoch
     *    ---- | ----- | -------------
     *       0 |     0 |             0
     *      98 |     0 |             1
     *     198 |     1 |             2
     *
     *  - after 2022-01-26:
     *    Rank | Epoch | Correct Epoch
     *    ---- | ----- | -------------
     *       0 |     1 |             0
     *      98 |     1 |             1
     *     198 |     2 |             2
     *
     * NB: 98/198 are ranks for multi partner CP, other types of CP have different ranks.
     * We cannot use the rank value to infer epoch, only the order.
     */

    const firstPoint = serie.points[0];
    if (firstPoint.rank === 0 && firstPoint.epoch === 0) {
        // before 2022-01-26 situation:
        // the rank 0 epoch is the only correct one, all other ones must be incremented by 1
        for (const point of serie.points) {
            if (point.rank !== 0) {
                point.epoch += 1;
            }
        }
    } else if (firstPoint.rank === 0 && firstPoint.epoch === 1) {
        // after 2022-01-26 situation:
        // the rank 0 epoch is the only wrong one and must be set to 0
        firstPoint.epoch = 0;
    }
}

export function buildSeries(
    cpPerformances: PerformanceType[],
    computePlanKey: string
): SerieT[] {
    // create series from test tasks
    const series: SerieT[] = [];

    for (const performance of cpPerformances) {
        const point: PointT = {
            rank: performance.compute_task.rank,
            perf: performance.perf,
            testTaskKey: performance.compute_task.key,
            epoch: getEpochOrRoundAsNumber(performance.compute_task.epoch),
            round: getEpochOrRoundAsNumber(performance.compute_task.round_idx),
        };

        const serieFeatures = buildSerieFeatures(performance, computePlanKey);

        const serie = findSerie(series, serieFeatures);
        if (serie) {
            serie.points.push(point);
        } else {
            series.push({
                // The couple (computePlanKey, id) should be unique
                // id is an incremented number
                id: uuidv4(),
                points: [point],
                ...serieFeatures,
            });
        }
    }

    // In MDY, testtuple registration didn't use the correct epochs
    for (const serie of series) {
        fixEpoch(serie);
    }

    return series;
}

export function buildSeriesGroups(series: SerieT[]): SerieT[][] {
    const groups = [];

    const metricNames = new Set(
        series.map((serie) => serie.metricName.toLowerCase())
    );
    for (const metricName of metricNames) {
        const metricGroup = series.filter(
            (serie) => serie.metricName.toLowerCase() === metricName
        );

        groups.push(metricGroup);
    }
    return groups;
}

const average = (values: number[]): number => {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
};

export function buildAverageSerie(
    series: SerieT[],
    name: string
): SerieT | null {
    if (series.length < 2) {
        return null;
    }

    const ranksPerfs: Record<
        number,
        { epoch: number; round: number; perfs: number[] }
    > = {};

    for (const serie of series) {
        for (const point of serie.points) {
            if (point.perf !== null) {
                if (ranksPerfs[point.rank]) {
                    ranksPerfs[point.rank] = {
                        epoch: point.epoch,
                        round: point.round,
                        perfs: [...ranksPerfs[point.rank].perfs, point.perf],
                    };
                } else {
                    ranksPerfs[point.rank] = {
                        epoch: point.epoch,
                        round: point.round,
                        perfs: [point.perf],
                    };
                }
            }
        }
    }

    // only includes points where we have values for all series
    const points: PointT[] = Object.entries(ranksPerfs)
        .filter(([, { perfs }]) => perfs.length === series.length)
        .map(([rank, { epoch, round, perfs }]) => ({
            rank: parseInt(rank),
            epoch,
            round,
            perf: average(perfs),
            testTaskKey: null,
        }));

    return {
        id: uuidv4(),
        points: points,
        algoKey: uuidv4(),
        datasetKey: uuidv4(),
        dataSampleKeys: [],
        worker: name,
        metricKey: uuidv4(),
        metricName: name,
        computePlanKey: uuidv4(),
    };
}

export const getSeriesNodes = (series: SerieT[]): NodeType[] => {
    const nodes: string[] = [];
    for (const serie of series) {
        if (!nodes.includes(serie.worker)) {
            nodes.push(serie.worker);
        }
    }
    return nodes.map((node) => ({ id: node, is_current: false }));
};

const getAllPoints = (series: SerieT[]): PointT[] => {
    let res: PointT[] = [];
    for (const serie of series) {
        res = [...res, ...serie.points];
    }
    return res;
};

export const getMaxRank = (series: SerieT[]): number => {
    const points = getAllPoints(series);
    const ranks = points.map((p) => p.rank);
    return Math.max(0, ...ranks);
};

export const getMaxRankWithPerf = (series: SerieT[]): number => {
    const points = getAllPoints(series);
    const ranks = points.filter((p) => p.perf !== null).map((p) => p.rank);
    return Math.max(0, ...ranks);
};

export const getMaxEpoch = (series: SerieT[]): number => {
    const points = getAllPoints(series);
    const epochs = points.map((p) => p.epoch);
    return Math.max(0, ...epochs);
};

export const getMaxEpochWithPerf = (series: SerieT[]): number => {
    const points = getAllPoints(series);
    const epochs = points.filter((p) => p.perf !== null).map((p) => p.epoch);
    return Math.max(0, ...epochs);
};

export const getMaxRound = (series: SerieT[]): number => {
    const points = getAllPoints(series);
    const rounds = points.filter((p) => !isNaN(p.round)).map((p) => p.round);
    return Math.max(0, ...rounds);
};

export const getMaxRoundWithPerf = (series: SerieT[]): number => {
    const points = getAllPoints(series);
    const rounds = points
        .filter((p) => p.perf !== null && !isNaN(p.round))
        .map((p) => p.round);
    return Math.max(0, ...rounds);
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
    a: SerieRankData,
    b: SerieRankData
): -1 | 0 | 1 => {
    const nodesRes = compareNodes(a.worker, b.worker);
    if (nodesRes !== 0) {
        return nodesRes;
    }
    return compareSeries(a, b);
};

export const compareDataPoint = (a: DataPoint, b: DataPoint) => {
    if (a.y < b.y) {
        return -1;
    }
    if (a.y > b.y) {
        return 1;
    }
    return 0;
};
