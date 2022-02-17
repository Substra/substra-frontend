import { useContext } from 'react';

import { ChartDataset, ScatterDataPoint } from 'chart.js';

import { HighlightedSerie, SerieT } from '@/modules/series/SeriesTypes';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import usePerfChartDatasetStyle from '@/hooks/usePerfChartDatasetStyle';

export interface DataPoint extends ScatterDataPoint {
    x: number;
    y: number;
    testTaskKey: string;
    worker: string;
    computePlanKey: string;
    serieId: number;
}

export type PerfChartDataset = ChartDataset<'line', DataPoint[]>;

const useBuildPerfChartDataset = (): ((
    serie: SerieT,
    label: string,
    highlightedSerie: HighlightedSerie | undefined
) => PerfChartDataset) => {
    const { xAxisMode } = useContext(PerfBrowserContext);
    const datasetStyle = usePerfChartDatasetStyle();

    return (
        serie: SerieT,
        label: string,
        highlightedSerie?: {
            id: number;
            computePlanKey: string;
        }
    ): PerfChartDataset => {
        return {
            label,
            data: serie.points.map(
                (point): DataPoint => ({
                    x: xAxisMode === 'rank' ? point.rank : point.epoch,
                    y: point.perf as number,
                    testTaskKey: point.testTaskKey,
                    worker: serie.worker,
                    computePlanKey: serie.computePlanKey,
                    serieId: serie.id,
                })
            ),
            parsing: false,
            // draw highlighted serie on top
            order: serie.id === highlightedSerie?.id ? 0 : 1,
            ...datasetStyle(serie, highlightedSerie),
        };
    };
};
export default useBuildPerfChartDataset;
