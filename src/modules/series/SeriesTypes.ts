import { ScatterDataPoint } from 'chart.js';

export type SerieFeaturesT = {
    algoKey: string;
    datasetKey: string;
    dataSampleKeys: string[];
    worker: string;
    metricKey: string;
    metricName: string;
    computePlanKey: string;
};

export type PointT = {
    rank: number;
    round: number;
    perf: number | null;
    testTaskKey: string | null;
};

export type DataPointT = ScatterDataPoint & {
    x: number;
    y: number;
    testTaskKey: string | null;
    worker: string;
    computePlanKey: string;
    serieId: string;
};

export type SerieT = SerieFeaturesT & {
    id: string;
    points: PointT[];
};

export type HighlightedSerieT = {
    id: string;
    computePlanKey: string;
};

export type HighlightedParamsProps = {
    highlightedSerie?: HighlightedSerieT;
    highlightedComputePlanKey?: string;
    highlightedOrganizationId?: string;
};

export type SerieRankDataT = {
    id: string;
    computePlanKey: string;
    testTaskKey: string | null;
    worker: string;
    perf: string;
};
