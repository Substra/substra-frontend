export interface SerieFeaturesT {
    algoKey: string;
    algoName: string;
    datasetKey: string;
    datasetName: string;
    dataSampleKeys: string[];
    worker: string;
    metricKey: string;
    metricName: string;
}

export interface PointT {
    rank: number;
    perf: number | null;
    testTaskKey: string;
}

export interface SerieT extends SerieFeaturesT {
    id: number;
    points: PointT[];
}

export type Index<Type> = Record<string, Type>;
