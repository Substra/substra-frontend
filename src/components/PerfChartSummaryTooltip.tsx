import { useContext } from 'react';

import PerfChartTooltipItem from './PerfChartTooltipItem';
import { List, ListItem } from '@chakra-ui/react';

import { capitalize } from '@/libs/utils';

import { DataPoint } from '@/hooks/useBuildPerfChartDataset';
import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

interface PerfChartTooltipProps {
    showTooltip: () => void;
    hideTooltip: () => void;
    canvasBoundingRect: DOMRect | undefined;
    points: DataPoint[];
}

const PerfChartSummaryTooltip = ({
    showTooltip,
    hideTooltip,
    canvasBoundingRect,
    points,
}: PerfChartTooltipProps): JSX.Element => {
    const { xAxisMode } = useContext(PerfBrowserContext);

    const firstFivePoints = points.slice(0, 5);
    const remainingCount = Math.max(points.length - 5, 0);

    // Position
    // defaults to tooltip below the canvas
    let top = 'calc(100% - 30px)';

    // check if there is enough space below the canvas to display the full tooltip
    // if there isn't, then place tooltip above the canvas
    if (canvasBoundingRect) {
        const tooltipHeight =
            18 + // header
            firstFivePoints.length * 36 + // items
            (remainingCount > 0 ? 30 : 0) + // footer
            24; // padding
        if (tooltipHeight + canvasBoundingRect.bottom > window.innerHeight) {
            top = `calc(-${tooltipHeight}px - 10px)`;
        }
    }

    return (
        <List
            backgroundColor="white"
            position="absolute"
            top={top}
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
            >{`${capitalize(xAxisMode)} ${points[0].x}`}</ListItem>
            {firstFivePoints.map((point) => (
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
