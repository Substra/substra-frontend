import usePerfBrowserColors from '@/hooks/usePerfBrowserColors';
import usePerfBrowserPointStyles from '@/hooks/usePerfBrowserPointStyles';
import { HighlightedParams, SerieT } from '@/modules/series/SeriesTypes';

const usePerfChartDatasetStyle = () => {
    const { getColor } = usePerfBrowserColors();
    const { getPointStyle } = usePerfBrowserPointStyles();

    const datasetStyle = (
        serie: SerieT,
        {
            highlightedSerie,
            highlightedComputePlanKey,
            highlightedNodeId,
        }: HighlightedParams
    ) => {
        const isHighlighted =
            // no highlight on chart
            (highlightedSerie === undefined &&
                highlightedComputePlanKey === undefined &&
                highlightedNodeId === undefined) ||
            // current serie matches highlightedSerie
            (serie.id === highlightedSerie?.id &&
                serie.computePlanKey === highlightedSerie?.computePlanKey) ||
            // current serie matches highlighted compute plan
            (serie.computePlanKey === highlightedComputePlanKey &&
                highlightedNodeId === undefined) ||
            // current serie matches highlightedNodeId
            (serie.worker === highlightedNodeId &&
                serie.computePlanKey === highlightedComputePlanKey);

        const lineColor = isHighlighted
            ? getColor(serie, '500')
            : getColor(serie, '100');
        const lightColor = getColor(serie, '100');

        return {
            // draw highlighted serie on top
            order: isHighlighted ? 0 : 1,
            // line styles
            borderColor: lineColor,
            borderWidth: 1.5,
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
