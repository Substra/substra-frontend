import PerfChartTooltipItem from './PerfChartTooltipItem';
import { List } from '@chakra-ui/react';

import { DataPoint } from '@/hooks/useBuildPerfChartDataset';

const TOOLTIP_WIDTH = 340;

interface PerfChartTooltipProps {
    x: number;
    y: number;
    showTooltip: () => void;
    hideTooltip: () => void;
    points: DataPoint[];
}

const PerfChartTooltip = ({
    x,
    y,
    showTooltip,
    hideTooltip,
    points,
}: PerfChartTooltipProps): JSX.Element => (
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
            <PerfChartTooltipItem point={point} key={point.serieId} />
        ))}
    </List>
);

export default PerfChartTooltip;
