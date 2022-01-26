import PerfChartTooltipItem from './PerfChartTooltipItem';
import { List } from '@chakra-ui/react';

import { SerieT } from '@/modules/series/SeriesTypes';
import { getLineId } from '@/modules/series/SeriesUtils';

import { DataPoint } from '@/hooks/useBuildPerfChartDataset';

const TOOLTIP_WIDTH = 340;

interface PerfChartTooltipProps {
    series: SerieT[];
    x: number;
    y: number;
    showTooltip: () => void;
    hideTooltip: () => void;
    points: DataPoint[];
}

const PerfChartTooltip = ({
    series,
    x,
    y,
    showTooltip,
    hideTooltip,
    points,
}: PerfChartTooltipProps): JSX.Element => {
    const lineId = getLineId(series);

    return (
        <List
            backgroundColor="rgba(255,255,255, 0.92)"
            position="absolute"
            top={`${y}px`}
            left={`${x + 10}px`}
            width={`${TOOLTIP_WIDTH}px`}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            padding="3"
            spacing="3"
            boxShadow="md"
            zIndex="tooltip"
        >
            {points.map((point) => (
                <PerfChartTooltipItem
                    point={point}
                    lineId={lineId}
                    key={point.testTaskKey}
                />
            ))}
        </List>
    );
};

export default PerfChartTooltip;
