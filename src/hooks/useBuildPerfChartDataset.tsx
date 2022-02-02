import { ChartDataset, ScatterDataPoint } from 'chart.js';

import { SerieT } from '@/modules/series/SeriesTypes';

import usePerfBrowserColors from '@/hooks/usePerfBrowserColors';

interface ChartStyle {
    color: string;
    colorLight: string;
    colorScheme: string;
    borderWidth: number;
}

interface HighlightedSerie {
    id: number;
    computePlanKey: string;
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
    highlightedSerie?: HighlightedSerie
) => PerfChartDataset) => {
    const { getColor, getColorScheme } = usePerfBrowserColors();

    const getLineColor = (
        chartStyle: ChartStyle,
        highlightedSerie: HighlightedSerie | undefined,
        serie: SerieT
    ) => {
        if (highlightedSerie === undefined) {
            return chartStyle.color;
        }
        if (
            serie.id === highlightedSerie.id &&
            serie.computePlanKey === highlightedSerie.computePlanKey
        ) {
            return chartStyle.color;
        }
        return chartStyle.colorLight;
    };

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
                colorLight: getColor(serie, '100'),
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
            borderColor: getLineColor(chartStyle, highlightedSerie, serie),
            // line styles
            borderWidth: chartStyle.borderWidth,
            // point styles
            pointBackgroundColor: 'white',
            pointBorderColor: getLineColor(chartStyle, highlightedSerie, serie),
            pointBorderWidth: chartStyle.borderWidth,
            // draw highlighted serie on top
            order: serie.id === highlightedSerie?.id ? 0 : 1,
        };
    };
};
export default useBuildPerfChartDataset;
