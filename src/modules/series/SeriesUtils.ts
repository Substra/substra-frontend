import { Index, PointT, SerieFeaturesT, SerieT } from './SeriesTypes';

import { DatasetStubType } from '@/modules/datasets/DatasetsTypes';
import { MetricType } from '@/modules/metrics/MetricsTypes';
import {
    CompositeTraintupleT,
    TesttupleT,
    TraintupleT,
    TupleStatus,
} from '@/modules/tasks/TuplesTypes';

function buildSerieFeatures(
    testtuple: TesttupleT,
    traintuple: TraintupleT | CompositeTraintupleT,
    dataset: DatasetStubType,
    metric: MetricType
): SerieFeaturesT {
    return {
        algoKey: traintuple.algo.key,
        algoName: traintuple.algo.name,
        datasetKey: dataset.key,
        datasetName: dataset.name,
        dataSampleKeys: testtuple.test.data_sample_keys,
        worker: testtuple.worker,
        metricKey: metric.key,
        objectiveName: metric.name,
        metricName: metric.metrics_name,
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
    traintuples: TraintupleT[],
    compositeTraintuples: CompositeTraintupleT[],
    datasets: DatasetStubType[],
    metrics: MetricType[]
): SerieT[] {
    // create indexes
    const traintupleIndex = buildIndex<TraintupleT | CompositeTraintupleT>([
        ...traintuples,
        ...compositeTraintuples,
    ]);
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
            traintupleIndex[testtuple.parent_task_keys[0]],
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
