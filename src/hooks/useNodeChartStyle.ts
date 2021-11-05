import { useMemo } from 'react';

import useAppSelector from './useAppSelector';

import chakraTheme from '@/assets/chakraTheme';

const CHART_COLORS = [
    chakraTheme.colors.red['500'],
    chakraTheme.colors.orange['500'],
    chakraTheme.colors.yellow['500'],
    chakraTheme.colors.green['500'],
    chakraTheme.colors.teal['500'],
    chakraTheme.colors.blue['500'],
    chakraTheme.colors.cyan['500'],
    chakraTheme.colors.purple['500'],
    chakraTheme.colors.pink['500'],
];

export interface ChartStyle {
    color: string;
    borderWidth: number;
}

const DEFAULT_CHART_STYLE: ChartStyle = {
    color: CHART_COLORS[0],
    borderWidth: 2,
};

const useNodeChartStyle = (): ((nodeId: string) => ChartStyle) => {
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
                borderWidth: 2,
            };
        }

        return (nodeId: string): ChartStyle => {
            return chartStyles[nodeId] || DEFAULT_CHART_STYLE;
        };
    }, nodeIds);
};

export default useNodeChartStyle;
