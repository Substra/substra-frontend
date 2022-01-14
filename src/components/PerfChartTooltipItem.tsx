import { useContext } from 'react';

import { HStack, ListItem, Text } from '@chakra-ui/react';
import { RiGitCommitLine } from 'react-icons/ri';

import { DataPoint } from '@/hooks/useBuildPerfChartDataset';
import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import usePerfBrowserColors from '@/hooks/usePerfBrowserColors';

import IconTag from '@/components/IconTag';

const PerfChartTooltipItem = ({
    point,
    lineId,
}: {
    point: DataPoint;
    lineId: (serieId: number) => number;
}): JSX.Element => {
    const { sortedComputePlanKeys } = useContext(PerfBrowserContext);
    const { getColorScheme } = usePerfBrowserColors();

    return (
        <ListItem
            display="flex"
            justifyContent="space-between"
            alignItems="center"
        >
            <HStack spacing="2.5">
                {point.worker === 'average' ? (
                    <>
                        <IconTag
                            icon={RiGitCommitLine}
                            backgroundColor="black.100"
                            fill="black.500"
                        />
                        <Text fontSize="xs" fontWeight="semibold">
                            {point.testTaskKey}
                        </Text>
                    </>
                ) : (
                    <>
                        <IconTag
                            icon={RiGitCommitLine}
                            backgroundColor={`${getColorScheme(point)}.100`}
                            fill={`${getColorScheme(point)}.500`}
                        />
                        <HStack spacing="1">
                            <Text fontSize="xs" fontWeight="semibold">
                                {sortedComputePlanKeys.length > 1
                                    ? `CP${
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
                    </>
                )}
            </HStack>
            <Text fontSize="xs">{point.y.toFixed(2)}</Text>
        </ListItem>
    );
};

export default PerfChartTooltipItem;
