import { useRef, useState } from 'react';

import { SerieT, DataPoint } from '@/modules/series/SeriesTypes';

import PerfChartSummaryTooltip from '@/components/PerfChartSummaryTooltip';
import PerfChartTooltip from '@/components/PerfChartTooltip';

const usePerfChartTooltip = (
    series: SerieT[],
    summary: boolean
): {
    tooltip: React.ReactNode;
    tooltipPluginOptions: Record<string, unknown>;
} => {
    const [points, setPoints] = useState<DataPoint[]>([]);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [displayed, setDisplayed] = useState(false);
    const [canvasBoundingRect, setCanvasBoundingRect] = useState<DOMRect>();
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const showTooltip = () => {
        setDisplayed(true);
        if (timeout.current) {
            clearTimeout(timeout.current);
        }
    };

    const hideTooltip = () => {
        if (summary) {
            setDisplayed(false);
        } else {
            timeout.current = setTimeout(() => setDisplayed(false), 1000);
        }
    };

    const tooltip =
        displayed &&
        (summary ? (
            <PerfChartSummaryTooltip
                hideTooltip={hideTooltip}
                showTooltip={showTooltip}
                canvasBoundingRect={canvasBoundingRect}
                points={points}
            />
        ) : (
            <PerfChartTooltip
                hideTooltip={hideTooltip}
                showTooltip={showTooltip}
                x={position.x}
                y={position.y}
                points={points}
            />
        ));

    const tooltipPluginOptions = {
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
                        (dataPoint: { raw: DataPoint }) => dataPoint.raw
                    )
                );
                if (summary) {
                    setCanvasBoundingRect(
                        context.chart.canvas.getBoundingClientRect()
                    );
                } else {
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
    };

    return {
        tooltip,
        tooltipPluginOptions,
    };
};

export default usePerfChartTooltip;
