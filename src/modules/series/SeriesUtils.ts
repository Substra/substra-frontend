import { Index, PointT, SerieFeaturesT, SerieT } from './SeriesTypes';

import { DatasetStubType } from '@/modules/datasets/DatasetsTypes';
import { MetricType } from '@/modules/metrics/MetricsTypes';
import {
    CompositeTraintupleT,
    TesttupleT,
    TraintupleT,
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
        dataSampleKeys: testtuple.dataset.data_sample_keys,
        worker: testtuple.dataset.worker,
        metricKey: metric.key,
        metricName: metric.name,
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
    datasetIndex: Index<DatasetStubType>,
    metricIndex: Index<MetricType>,
    traintupleIndex: Index<TraintupleT>,
    compositeTraintupleIndex: Index<CompositeTraintupleT>
): SerieT[] {
    // create series from test tasks
    const series: SerieT[] = [];

    for (const testtuple of testtuples) {
        const point: PointT = {
            rank: testtuple.rank,
            perf: testtuple.status === 'done' ? testtuple.dataset.perf : null,
            testTaskKey: testtuple.key,
        };

        const serieFeatures = buildSerieFeatures(
            testtuple,
            traintupleIndex[testtuple.traintuple_key] ||
                compositeTraintupleIndex[testtuple.traintuple_key],
            datasetIndex[testtuple.dataset.key],
            metricIndex[testtuple.objective.key]
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
export function buildIndex<Type extends HasKey>(assets: Type[]): Index<Type> {
    const index: Record<string, Type> = {};
    for (const asset of assets) {
        index[asset.key] = asset;
    }
    return index;
}