import { Index, PointT, SerieFeaturesT, SerieT } from './SeriesTypes';
import { v4 as uuidv4 } from 'uuid';

import { DatasetStubType } from '@/modules/datasets/DatasetsTypes';
import { MetricType } from '@/modules/metrics/MetricsTypes';
import { NodeType } from '@/modules/nodes/NodesTypes';
import { getPerf } from '@/modules/tasks/TasksUtils';
import { TesttupleStub } from '@/modules/tasks/TuplesTypes';

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
                    id: series.length,
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
    return series;
}

interface HasKey {
    key: string;
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

export const average = (values: number[]): number => {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
};

export function buildAverageSerie(
    series: SerieT[],
    enablePartialAverage?: boolean,
    name?: string
): SerieT | null {
    // if enablePartialAverage is true, then the average serie will have points even if not all series have points for a given rank.

    if (series.length < 2) {
        return null;
    }

    const ranksPerfs: Record<number, number[]> = {};

    for (const serie of series) {
        for (const point of serie.points) {
            if (point.perf !== null) {
                ranksPerfs[point.rank] = ranksPerfs[point.rank]
                    ? [...ranksPerfs[point.rank], point.perf]
                    : [point.perf];
            }
        }
    }

    // only includes points where we have values for all series
    // with enablePartialAverage option, include points where we have at least 1 value
    const points: PointT[] = Object.entries(ranksPerfs)
        .filter(
            ([, perfs]) =>
                perfs.length > 0 &&
                (enablePartialAverage || perfs.length === series.length)
        )
        .map(([rank, perfs]) => ({
            rank: parseInt(rank),
            perf: average(perfs),
            testTaskKey: uuidv4(),
        }));

    return {
        id: 0,
        points: points,
        algoKey: uuidv4(),
        algoName: name || 'average',
        datasetKey: uuidv4(),
        datasetName: name || 'average',
        dataSampleKeys: [],
        worker: name || 'average',
        metricKey: uuidv4(),
        metricName: name || 'average',
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

export const getMaxRank = (series: SerieT[]): number => {
    return series.reduce((max, serie) => {
        const serieMax = serie.points.reduce(
            (max, point) => Math.max(max, point.rank),
            0
        );
        return Math.max(max, serieMax);
    }, 0);
};

export const getLineId = (series: SerieT[]): ((serieId: number) => number) => {
    const sortedSerieIds = series.map((s) => s.id);
    sortedSerieIds.sort();
    return (serieId: number): number => sortedSerieIds.indexOf(serieId) + 1;
};
