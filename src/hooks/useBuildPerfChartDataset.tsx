import { ChartDataset } from 'chart.js';

import { XAxisMode } from '@/hooks/usePerfBrowser';
import usePerfChartDatasetStyle from '@/hooks/usePerfChartDatasetStyle';
import {
    DataPoint,
    HighlightedParams,
    SerieT,
} from '@/modules/series/SeriesTypes';

export type PerfChartDataset = ChartDataset<'line', DataPoint[]>;

const useBuildPerfChartDataset = (): ((
    serie: SerieT,
    xAxisMode: XAxisMode,
    highlightedParams: HighlightedParams
) => PerfChartDataset) => {
    const datasetStyle = usePerfChartDatasetStyle();

    return (
        serie: SerieT,
        xAxisMode: XAxisMode,
        highlightedParams: HighlightedParams
    ): PerfChartDataset => {
        return {
            label: serie.id,
            data: serie.points.map(
                (point): DataPoint => ({
                    x: point[xAxisMode],
                    y: point.perf as number,
                    testTaskKey: point.testTaskKey,
                    worker: serie.worker,
                    computePlanKey: serie.computePlanKey,
                    serieId: serie.id,
                })
            ),
            parsing: false,
            ...datasetStyle(serie, highlightedParams),
        };
    };
};
export default useBuildPerfChartDataset;
