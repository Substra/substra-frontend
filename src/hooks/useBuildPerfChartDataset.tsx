import { useCallback } from 'react';

import { ChartDataset } from 'chart.js';

import { XAxisModeT } from '@/hooks/usePerfBrowser';
import usePerfChartDatasetStyle from '@/hooks/usePerfChartDatasetStyle';
import {
    DataPointT,
    HighlightedParamsProps,
    SerieT,
} from '@/types/SeriesTypes';

type PerfChartDatasetProps = ChartDataset<'line', DataPointT[]>;

const useBuildPerfChartDataset = (): ((
    serie: SerieT,
    xAxisMode: XAxisModeT,
    highlightedParams: HighlightedParamsProps
) => PerfChartDatasetProps) => {
    const datasetStyle = usePerfChartDatasetStyle();

    return useCallback(
        (
            serie: SerieT,
            xAxisMode: XAxisModeT,
            highlightedParams: HighlightedParamsProps
        ): PerfChartDatasetProps => {
            return {
                label: serie.id,
                data: serie.points.map(
                    (point): DataPointT => ({
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
        },
        [datasetStyle]
    );
};
export default useBuildPerfChartDataset;
