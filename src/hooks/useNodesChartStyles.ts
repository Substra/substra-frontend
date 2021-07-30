import { useMemo } from 'react';

import useAppSelector from './useAppSelector';

const CHART_COLORS = ['#115CDF', '#DF1167', '#11DF5E', '#DFBF11'];
const POINT_STYLES: string[] = [
    'circle',
    'rectRot',
    'rect',
    // other available styles in ChartJS:
    // 'cross',
    // 'crossRot',
    // 'dash',
    // 'line',
    // 'rectRounded',
    // 'star',
    // 'triangle',
];

interface ChartStyle {
    color: string;
    pointStyle: string;
}

const useNodesChartStyles = (): Record<string, ChartStyle> => {
    // get nodes sorted alphabetically
    const nodeIds = useAppSelector((state) =>
        state.nodes.nodes.map((node) => node.id).sort()
    );

    // memoize the node styles so that they won't change
    return useMemo(() => {
        const chartStyles: Record<string, ChartStyle> = {};
        for (let i = 0; i < nodeIds.length; i++) {
            const nodeId = nodeIds[i];
            chartStyles[nodeId] = {
                color: CHART_COLORS[i % CHART_COLORS.length],
                pointStyle: POINT_STYLES[i % POINT_STYLES.length],
            };
        }
        return chartStyles;
    }, nodeIds);
};

export default useNodesChartStyles;