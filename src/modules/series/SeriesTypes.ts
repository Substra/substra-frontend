import { ScatterDataPoint } from 'chart.js';

export interface SerieFeaturesT {
    algoKey: string;
    datasetKey: string;
    dataSampleKeys: string[];
    worker: string;
    metricKey: string;
    metricName: string;
    computePlanKey: string;
}

export interface PointT {
    rank: number;
    round: number;
    perf: number | null;
    testTaskKey: string | null;
}

export interface DataPoint extends ScatterDataPoint {
    x: number;
    y: number;
    testTaskKey: string | null;
    worker: string;
    computePlanKey: string;
    serieId: string;
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
