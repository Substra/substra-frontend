import PerfChartTooltipItem from './PerfChartTooltipItem';
import { List, ListItem } from '@chakra-ui/react';

import { SerieT } from '@/modules/series/SeriesTypes';
import { getLineId } from '@/modules/series/SeriesUtils';

import { DataPoint } from '@/hooks/useBuildPerfChartDataset';

interface PerfChartTooltipProps {
    series: SerieT[];
    showTooltip: () => void;
    hideTooltip: () => void;
    points: DataPoint[];
}

const PerfChartSummaryTooltip = ({
    series,
    showTooltip,
    hideTooltip,
    points,
}: PerfChartTooltipProps): JSX.Element => {
    const lineId = getLineId(series);

    const firstFivePoints = points.slice(0, 5);
    const remainingCount = Math.max(points.length - 5, 0);

    return (
        <List
            backgroundColor="white"
            position="absolute"
            top="calc(100% - 30px)"
            left="0"
            right="0"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            padding="3"
            spacing="3"
            boxShadow="md"
            zIndex="tooltip"
        >
            <ListItem
                fontSize="xs"
                color="gray.700"
                fontWeight="semibold"
                marginBottom="3"
            >{`Rank ${points[0].x}`}</ListItem>
            {firstFivePoints.map((point) => (
                <PerfChartTooltipItem
                    point={point}
                    lineId={lineId}
                    key={point.testTaskKey}
                />
            ))}
            {remainingCount && (
                <ListItem
                    backgroundColor="gray.50"
                    marginTop="3"
                    padding="1.5"
                    textAlign="center"
                    fontSize="xs"
                    color="gray.700"
                >{`And ${remainingCount} others`}</ListItem>
            )}
        </List>
    );
};

export default PerfChartSummaryTooltip;
