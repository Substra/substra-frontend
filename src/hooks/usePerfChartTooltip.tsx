import { useCallback, useMemo, useRef, useState } from 'react';

import { DataPointT } from '@/modules/series/SeriesTypes';

import PerfChartSummaryTooltip from '@/components/PerfChartSummaryTooltip';
import PerfChartTooltip from '@/components/PerfChartTooltip';

const usePerfChartTooltip = (
    summary: boolean
): {
    tooltip: React.ReactNode;
    tooltipPluginOptions: Record<string, unknown>;
} => {
    const [points, setPoints] = useState<DataPointT[]>([]);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [displayed, setDisplayed] = useState(false);
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const showTooltip = () => {
        setDisplayed(true);
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
    };

    const hideTooltip = useCallback(() => {
        if (summary) {
            setDisplayed(false);
        } else {
            timeout.current = setTimeout(() => setDisplayed(false), 1000);
        }
    }, [summary]);

    const tooltip =
        displayed &&
        (summary ? (
            <PerfChartSummaryTooltip points={points} />
        ) : (
            <PerfChartTooltip
                hideTooltip={hideTooltip}
                showTooltip={showTooltip}
                x={position.x}
                y={position.y}
                points={points}
            />
        ));

    const tooltipPluginOptions = useMemo(
        () => ({
            enabled: false,
            external: function (context: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                tooltip: any;
                chart: { canvas: HTMLCanvasElement };
            }) {
                const tooltipModel = context.tooltip;
                if (tooltipModel && tooltipModel.opacity) {
                    setPoints(
                        tooltipModel.dataPoints.map(
                            (dataPoint: { raw: DataPointT }) => dataPoint.raw
                        )
                    );
                    if (!summary) {
                        setPosition({
                            x: parseInt(tooltipModel.caretX),
                            y: parseInt(tooltipModel.caretY),
                        });
                    }
                    showTooltip();
                } else {
                    hideTooltip();
                }
            },
        }),
        [hideTooltip, summary]
    );

    return {
        tooltip,
        tooltipPluginOptions,
    };
};

export default usePerfChartTooltip;
