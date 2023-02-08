import { useContext } from 'react';

import { List, ListItem } from '@chakra-ui/react';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import { capitalize } from '@/libs/utils';
import { DataPointT } from '@/modules/series/SeriesTypes';
import { compareDataPoint } from '@/modules/series/SeriesUtils';

import PerfChartTooltipItem from '@/components/PerfChartTooltipItem';

type PerfChartTooltipProps = {
    points: DataPointT[];
};

const PerfChartSummaryTooltip = ({
    points,
}: PerfChartTooltipProps): JSX.Element => {
    const { xAxisMode } = useContext(PerfBrowserContext);

    const higherFivePoints = [...points]
        .sort(compareDataPoint)
        .slice(-5)
        .reverse();

    const remainingCount = Math.max(points.length - 5, 0);

    // Position tooltip at the bottom of the canvas
    const top = `calc(100% - ${higherFivePoints.length * 36 + 24}px)`;

    return (
        <List
            backgroundColor="white"
            position="absolute"
            top={top}
            left="0"
            right="0"
            // onMouseEnter={showTooltip}
            // onMouseLeave={hideTooltip}
            pointerEvents="none"
            padding="3"
            spacing="3"
            boxShadow="md"
            zIndex="dropdown"
            bg="rgba(255,255,255,0.8)"
        >
            <ListItem
                fontSize="xs"
                color="gray.700"
                fontWeight="semibold"
                marginBottom="3"
            >{`${capitalize(xAxisMode)} ${points[0].x}`}</ListItem>
            {higherFivePoints.map((point) => (
                <PerfChartTooltipItem point={point} key={point.serieId} />
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
