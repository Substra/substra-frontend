import { isAverageNode } from '@/modules/nodes/NodesUtils';
import { HighlightedSerie, SerieT } from '@/modules/series/SeriesTypes';

import usePerfBrowserColors from '@/hooks/usePerfBrowserColors';
import usePerfBrowserPointStyles from '@/hooks/usePerfBrowserPointStyles';

const usePerfChartDatasetStyle = () => {
    const { getColor } = usePerfBrowserColors();
    const { getPointStyle } = usePerfBrowserPointStyles();
    const getLineColor = (
        serie: SerieT,
        highlightedSerie: HighlightedSerie | undefined
    ) => {
        if (
            highlightedSerie === undefined ||
            (serie.id === highlightedSerie.id &&
                serie.computePlanKey === highlightedSerie.computePlanKey)
        ) {
            return getColor(serie, '500');
        }
        return getColor(serie, '100');
    };

    const datasetStyle = (
        serie: SerieT,
        highlightedSerie: HighlightedSerie | undefined
    ) => {
        const lineColor = getLineColor(serie, highlightedSerie);
        const lightColor = getColor(serie, '100');

        const dashed = isAverageNode(serie.worker);

        return {
            // line styles
            borderColor: lineColor,
            borderWidth: 1.5,
            ...(dashed
                ? {
                      borderDash: [4, 2],
                  }
                : {}),
            // point styles
            pointBackgroundColor: lightColor,
            pointBorderColor: lineColor,
            pointBorderWidth: 1.5,
            pointStyle: getPointStyle(serie, lineColor),
        };
    };

    return datasetStyle;
};
export default usePerfChartDatasetStyle;
