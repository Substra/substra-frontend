import { useContext } from 'react';

import { HStack, ListItem, Text } from '@chakra-ui/react';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import { DataPointT } from '@/types/SeriesTypes';

import PerfIconTag from '@/components/PerfIconTag';

const PerfChartTooltipItem = ({
    point,
}: {
    point: DataPointT;
}): JSX.Element => {
    const { getSerieIndex } = useContext(PerfBrowserContext);

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
                <Text fontSize="xs" fontWeight="semibold">
                    {`#${getSerieIndex(
                        point.computePlanKey,
                        point.serieId
                    )} • ${point.worker}`}
                </Text>
            </HStack>
            <Text fontSize="xs">{point.y.toFixed(3)}</Text>
        </ListItem>
    );
};

export default PerfChartTooltipItem;
