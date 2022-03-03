import { useContext } from 'react';

import { HStack, ListItem, Text } from '@chakra-ui/react';

import { isAverageNode } from '@/modules/nodes/NodesUtils';

import { DataPoint } from '@/hooks/useBuildPerfChartDataset';
import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

import PerfIconTag from '@/components/PerfIconTag';

const PerfChartTooltipItem = ({ point }: { point: DataPoint }): JSX.Element => {
    const { xAxisMode, getSerieIndex } = useContext(PerfBrowserContext);

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
                        {`#${getSerieIndex(
                            point.computePlanKey,
                            point.serieId
                        )} • ${point.worker} for ${xAxisMode} ${point.x}`}
                    </Text>
                ) : (
                    <Text fontSize="xs" fontWeight="semibold">
                        {`#${getSerieIndex(
                            point.computePlanKey,
                            point.serieId
                        )} • ${point.worker}`}
                    </Text>
                )}
            </HStack>
            <Text fontSize="xs">{point.y.toFixed(3)}</Text>
        </ListItem>
    );
};

export default PerfChartTooltipItem;
