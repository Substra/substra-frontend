import { SerieT } from '@/modules/series/SeriesTypes';

import useNodeChartStyle, { ChartStyle } from '@/hooks/useNodeChartStyle';

export interface DataPoint {
    x: number;
    y: number | null;
    testTaskKey: string;
    worker: string;
}

export type PerfChartDataset = Record<string, unknown>;

const useBuildPerfChartDataset = (): ((
    serie: SerieT,
    label: string,
    chartStyle?: ChartStyle
) => PerfChartDataset) => {
    const nodeChartStyle = useNodeChartStyle();

    return (
        serie: SerieT,
        label: string,
        chartStyle?: ChartStyle
    ): PerfChartDataset => {
        if (!chartStyle) {
            chartStyle = nodeChartStyle(serie.worker);
        }

        return {
            label,
            data: serie.points.map(
                (point): DataPoint => ({
                    x: point.rank,
                    y: point.perf,
                    testTaskKey: point.testTaskKey,
                    worker: serie.worker,
                })
            ),
            parsing: false,
            // styles
            backgroundColor: chartStyle.color,
            borderColor: chartStyle.color,
            // line styles
            borderWidth: chartStyle.borderWidth,
            // point styles
            pointStyle: chartStyle.pointStyle,
            pointBackgroundColor: 'white',
            pointBorderColor: chartStyle.color,
            pointBorderWidth: chartStyle.borderWidth,
        };
    };
};
export default useBuildPerfChartDataset;
