import { v4 as uuidv4 } from 'uuid';

import { HasKey } from '@/modules/common/CommonTypes';
import { DatasetStubType } from '@/modules/datasets/DatasetsTypes';
import { MetricType } from '@/modules/metrics/MetricsTypes';
import { NodeType } from '@/modules/nodes/NodesTypes';
import { compareNodes } from '@/modules/nodes/NodesUtils';
import { getPerf } from '@/modules/tasks/TasksUtils';
import { TesttupleStub } from '@/modules/tasks/TuplesTypes';

import {
    DataPoint,
    Index,
    PointT,
    SerieFeaturesT,
    SerieRankData,
    SerieT,
} from './SeriesTypes';

function buildSerieFeatures(
    testtuple: TesttupleStub,
    dataset: DatasetStubType,
    metric: MetricType
): SerieFeaturesT {
    return {
        algoKey: testtuple.algo.key,
        algoName: testtuple.algo.name,
        datasetKey: dataset.key,
        datasetName: dataset.name,
        dataSampleKeys: testtuple.test.data_sample_keys,
        worker: testtuple.worker,
        metricKey: metric.key,
        metricName: metric.name,
        computePlanKey: testtuple.compute_plan_key,
    };
}

function areSetEqual(s1: Set<string>, s2: Set<string>): boolean {
    if (s1.size !== s2.size) {
        return false;
    }

    for (const v of s1) {
        if (!s2.has(v)) {
            return false;
        }
    }

    return true;
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

function getEpoch(testtuple: TesttupleStub): number {
    /**
     * This extracts epochs from a testtuple metadata, taking into account that:
     *  * epoch is stored in metadata and may not be present
     *  * epoch is stored as string
     */
    const epochStr = testtuple.metadata.epoch;
    try {
        return parseInt(epochStr);
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
    testtuples: TesttupleStub[],
    datasets: DatasetStubType[],
    metrics: MetricType[]
): SerieT[] {
    // create indexes
    const datasetIndex = buildIndex<DatasetStubType>(datasets);
    const metricIndex = buildIndex(metrics);

    // create series from test tasks
    const series: SerieT[] = [];

    for (const testtuple of testtuples) {
        for (const metricKey of testtuple.test.metric_keys) {
            const point: PointT = {
                rank: testtuple.rank,
                perf: getPerf(testtuple, metricKey),
                testTaskKey: testtuple.key,
                epoch: getEpoch(testtuple),
            };

            const serieFeatures = buildSerieFeatures(
                testtuple,
                datasetIndex[testtuple.test.data_manager_key],
                metricIndex[metricKey]
            );

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
    }

    // sort points by rank
    for (const serie of series) {
        serie.points.sort((p1, p2) => p1.rank - p2.rank);
    }

    // In MDY, testtuple registration didn't use the correct epochs
    for (const serie of series) {
        fixEpoch(serie);
    }

    return series;
}

export function buildIndex<Type extends HasKey>(assets: Type[]): Index<Type> {
    const index: Record<string, Type> = {};
    for (const asset of assets) {
        index[asset.key] = asset;
    }
    return index;
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

    const ranksPerfs: Record<number, { epoch: number; perfs: number[] }> = {};

    for (const serie of series) {
        for (const point of serie.points) {
            if (point.perf !== null) {
                if (ranksPerfs[point.rank]) {
                    ranksPerfs[point.rank] = {
                        epoch: point.epoch,
                        perfs: [...ranksPerfs[point.rank].perfs, point.perf],
                    };
                } else {
                    ranksPerfs[point.rank] = {
                        epoch: point.epoch,
                        perfs: [point.perf],
                    };
                }
            }
        }
    }

    // only includes points where we have values for all series
    const points: PointT[] = Object.entries(ranksPerfs)
        .filter(([, { perfs }]) => perfs.length === series.length)
        .map(([rank, { epoch, perfs }]) => ({
            rank: parseInt(rank),
            epoch,
            perf: average(perfs),
            testTaskKey: null,
        }));

    return {
        id: uuidv4(),
        points: points,
        algoKey: uuidv4(),
        algoName: name,
        datasetKey: uuidv4(),
        datasetName: name,
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
