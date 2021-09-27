import { Index, PointT, SerieFeaturesT, SerieT } from './SeriesTypes';

import { DatasetStubType } from '@/modules/datasets/DatasetsTypes';
import { MetricType } from '@/modules/metrics/MetricsTypes';
import { TesttupleT, TupleStatus } from '@/modules/tasks/TuplesTypes';

function buildSerieFeatures(
    testtuple: TesttupleT,
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
        objectiveName: metric.name,
        metricName: metric.metrics_name,
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
    testtuples: TesttupleT[],
    datasets: DatasetStubType[],
    metrics: MetricType[]
): SerieT[] {
    // create indexes
    const datasetIndex = buildIndex<DatasetStubType>(datasets);
    const metricIndex = buildIndex(metrics);

    // create series from test tasks
    const series: SerieT[] = [];

    for (const testtuple of testtuples) {
        const point: PointT = {
            rank: testtuple.rank,
            perf:
                testtuple.status === TupleStatus.done
                    ? testtuple.test.perf
                    : null,
            testTaskKey: testtuple.key,
        };

        const serieFeatures = buildSerieFeatures(
            testtuple,
            datasetIndex[testtuple.test.data_manager_key],
            metricIndex[testtuple.test.objective_key]
        );

        const serie = findSerie(series, serieFeatures);
        if (serie) {
            serie.points.push(point);
        } else {
            series.push({
                // ID is an incremented number
                id: series.length,
                points: [point],
                ...serieFeatures,
            });
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
function buildIndex<Type extends HasKey>(assets: Type[]): Index<Type> {
    const index: Record<string, Type> = {};
    for (const asset of assets) {
        index[asset.key] = asset;
    }
    return index;
}

export function buildSeriesGroups(
    series: SerieT[],
    multiChart: boolean
): SerieT[][] {
    const groups = [];

    const metricNames = new Set(
        series.map((serie) => serie.metricName.toLowerCase())
    );
    for (const metricName of metricNames) {
        const metricGroup = series.filter(
            (serie) => serie.metricName.toLowerCase() === metricName
        );
        if (multiChart) {
            const workers = new Set(metricGroup.map((serie) => serie.worker));
            for (const worker of workers) {
                groups.push(
                    metricGroup.filter((serie) => serie.worker === worker)
                );
            }
        } else {
            groups.push(metricGroup);
        }
    }
    return groups;
}

export function groupSeriesByMetric(
    computePlansSeries: SerieT[],
    selectedComputePlanKeys: string[],
    selectedNodeKeys: string[]
): SerieT[][] {
    const filteredSeries = computePlansSeries.filter(
        (serie) =>
            selectedNodeKeys.includes(serie.worker) &&
            selectedComputePlanKeys.includes(serie.computePlanKey)
    );
    return buildSeriesGroups(filteredSeries, false);
}

const average = (values: number[]): number => {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
};

export function buildAverageSerie(series: SerieT[]): SerieT | null {
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
    const points: PointT[] = Object.entries(ranksPerfs)
        .filter(([, perfs]) => perfs.length === series.length)
        .map(([rank, perfs]) => ({
            rank: parseInt(rank),
            perf: average(perfs),
            testTaskKey: `average for rank ${rank}`,
        }));

    return {
        id: 0,
        points: points,
        algoKey: 'average',
        algoName: 'average',
        datasetKey: 'average',
        datasetName: 'average',
        dataSampleKeys: [],
        worker: 'average',
        metricKey: 'average',
        metricName: 'average',
        objectiveName: 'average',
        computePlanKey: 'average',
    };
}
