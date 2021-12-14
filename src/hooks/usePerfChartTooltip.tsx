import { useRef, useState } from 'react';

import { SerieT } from '@/modules/series/SeriesTypes';

import { DataPoint } from '@/hooks/useBuildPerfChartDataset';

import PerfChartTooltip from '@/components/PerfChartTooltip';

const usePerfChartTooltip = (
    series: SerieT[]
): {
    tooltip: React.ReactNode;
    tooltipPluginOptions: Record<string, unknown>;
} => {
    const [points, setPoints] = useState<DataPoint[]>([]);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [displayed, setDisplayed] = useState(false);
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const showTooltip = () => {
        setDisplayed(true);
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
    };

    const hideTooltip = () => {
        timeout.current = setTimeout(() => setDisplayed(false), 1000);
    };

    const tooltip = displayed && (
        <PerfChartTooltip
            series={series}
            hideTooltip={hideTooltip}
            showTooltip={showTooltip}
            x={position.x}
            y={position.y}
            points={points}
        />
    );

    const tooltipPluginOptions = {
        enabled: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        external: function (context: { tooltip: any }) {
            const tooltipModel = context.tooltip;
            if (tooltipModel && tooltipModel.opacity) {
                setPoints(
                    tooltipModel.dataPoints.map(
                        (dataPoint: { raw: DataPoint }) => dataPoint.raw
                    )
                );
                setPosition({
                    x: parseInt(tooltipModel.caretX),
                    y: parseInt(tooltipModel.caretY),
                });
                showTooltip();
            } else {
                hideTooltip();
            }
        },
    };

    return {
        tooltip,
        tooltipPluginOptions,
    };
};

export default usePerfChartTooltip;
