export interface SerieFeaturesT {
    algoKey: string;
    algoName: string;
    datasetKey: string;
    datasetName: string;
    dataSampleKeys: string[];
    worker: string;
    metricKey: string;
    metricName: string;
    computePlanKey: string;
}

export interface PointT {
    rank: number;
    epoch: number;
    perf: number | null;
    testTaskKey: string | null;
}

export interface SerieT extends SerieFeaturesT {
    id: string;
    points: PointT[];
}

export type Index<Type> = Record<string, Type>;

export interface HighlightedSerie {
    id: string;
    computePlanKey: string;
}

export interface HighlightedParams {
    highlightedSerie?: HighlightedSerie;
    highlightedComputePlanKey?: string;
    highlightedNodeId?: string;
}

export type SerieRankData = {
    id: string;
    computePlanKey: string;
    testTaskKey: string | null;
    worker: string;
    perf: string;
};
