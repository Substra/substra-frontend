import { useCallback } from 'react';

import usePerfBrowserColors from '@/hooks/usePerfBrowserColors';
import usePerfBrowserPointStyles from '@/hooks/usePerfBrowserPointStyles';
import { HighlightedParamsProps, SerieT } from '@/types/SeriesTypes';

const usePerfChartDatasetStyle = () => {
    const { getColor } = usePerfBrowserColors();
    const { getPointStyle } = usePerfBrowserPointStyles();

    const datasetStyle = useCallback(
        (
            serie: SerieT,
            {
                highlightedSerie,
                highlightedComputePlanKey,
                highlightedOrganizationId,
            }: HighlightedParamsProps
        ) => {
            const isHighlighted =
                // no highlight on chart
                (highlightedSerie === undefined &&
                    highlightedComputePlanKey === undefined &&
                    highlightedOrganizationId === undefined) ||
                // current serie matches highlightedSerie
                (serie.id === highlightedSerie?.id &&
                    serie.computePlanKey ===
                        highlightedSerie?.computePlanKey) ||
                // current serie matches highlighted compute plan
                (serie.computePlanKey === highlightedComputePlanKey &&
                    highlightedOrganizationId === undefined) ||
                // current serie matches highlightedOrganizationId
                (serie.worker === highlightedOrganizationId &&
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
        },
        [getColor, getPointStyle]
    );

    return datasetStyle;
};
export default usePerfChartDatasetStyle;
