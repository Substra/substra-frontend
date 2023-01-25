import { List } from '@chakra-ui/react';

import { DataPointT } from '@/types/SeriesTypes';

import PerfChartTooltipItem from '@/components/PerfChartTooltipItem';

const TOOLTIP_WIDTH = 340;

type PerfChartTooltipProps = {
    x: number;
    y: number;
    showTooltip: () => void;
    hideTooltip: () => void;
    points: DataPointT[];
};

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
        zIndex="dropdown"
    >
        {points.map((point) => (
            <PerfChartTooltipItem point={point} key={point.serieId} />
        ))}
    </List>
);

export default PerfChartTooltip;
