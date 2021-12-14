import { ChartDataset, ScatterDataPoint } from 'chart.js';

import { SerieT } from '@/modules/series/SeriesTypes';

import usePerfBrowserColors from '@/hooks/usePerfBrowserColors';

interface ChartStyle {
    color: string;
    colorScheme: string;
    borderWidth: number;
}

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
    chartStyle?: ChartStyle,
    highlightedSerie?: {
        id: number;
        computePlanKey: string;
    }
) => PerfChartDataset) => {
    const { getColor, getColorScheme } = usePerfBrowserColors();

    return (
        serie: SerieT,
        label: string,
        chartStyle?: ChartStyle,
        highlightedSerie?: {
            id: number;
            computePlanKey: string;
        }
    ): PerfChartDataset => {
        if (!chartStyle) {
            chartStyle = {
                colorScheme: getColorScheme(serie),
                color: getColor(serie, '500'),
                borderWidth: 2,
            };
        }

        return {
            label,
            data: serie.points.map(
                (point): DataPoint => ({
                    x: point.rank,
                    y: point.perf as number,
                    testTaskKey: point.testTaskKey,
                    worker: serie.worker,
                    computePlanKey: serie.computePlanKey,
                    serieId: serie.id,
                })
            ),
            parsing: false,
            // styles
            backgroundColor: chartStyle.color,
            borderColor: chartStyle.color,
            // line styles
            borderWidth:
                highlightedSerie !== undefined &&
                serie.id === highlightedSerie.id &&
                serie.computePlanKey === highlightedSerie.computePlanKey
                    ? 3
                    : chartStyle.borderWidth,
            // point styles
            pointBackgroundColor: 'white',
            pointBorderColor: chartStyle.color,
            pointBorderWidth: chartStyle.borderWidth,
        };
    };
};
export default useBuildPerfChartDataset;
