import { useContext } from 'react';

import { HStack, ListItem, Text } from '@chakra-ui/react';

import { isAverageNode } from '@/modules/nodes/NodesUtils';

import { DataPoint } from '@/hooks/useBuildPerfChartDataset';
import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

import PerfIconTag from '@/components/PerfIconTag';

const PerfChartTooltipItem = ({
    point,
    lineId,
}: {
    point: DataPoint;
    lineId: (serieId: string) => number;
}): JSX.Element => {
    const { sortedComputePlanKeys, xAxisMode } = useContext(PerfBrowserContext);

    return (
        <ListItem
            display="flex"
            justifyContent="space-between"
            alignItems="center"
        >
            <HStack spacing="2.5">
                <PerfIconTag
                    worker={point.worker}
                    computePlanKey={point.computePlanKey}
                />
                {isAverageNode(point.worker) ? (
                    <Text fontSize="xs" fontWeight="semibold">
                        {`${point.worker} for ${xAxisMode} ${point.x}`}
                    </Text>
                ) : (
                    <HStack spacing="1">
                        <Text fontSize="xs" fontWeight="semibold">
                            {sortedComputePlanKeys.length > 1
                                ? `#${
                                      sortedComputePlanKeys.indexOf(
                                          point.computePlanKey
                                      ) + 1
                                  } • ${point.worker}`
                                : point.worker}
                        </Text>
                        <Text as="span" fontSize="xs">
                            {`• L${lineId(point.serieId)}`}
                        </Text>
                    </HStack>
                )}
            </HStack>
            <Text fontSize="xs">{point.y.toFixed(3)}</Text>
        </ListItem>
    );
};

export default PerfChartTooltipItem;
