import { useContext } from 'react';

import { HStack, List, ListItem, Text } from '@chakra-ui/react';
import { RiGitCommitLine } from 'react-icons/ri';

import { SerieT } from '@/modules/series/SeriesTypes';

import { DataPoint } from '@/hooks/useBuildPerfChartDataset';
import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import usePerfBrowserColors from '@/hooks/usePerfBrowserColors';

import IconTag from '@/components/IconTag';

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
    const { sortedComputePlanKeys } = useContext(PerfBrowserContext);
    const { getColorScheme } = usePerfBrowserColors();

    const sortedSerieIds = series.map((s) => s.id);
    sortedSerieIds.sort();

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
            boxShadow="md"
        >
            {points.map((point) => (
                <ListItem
                    key={point.testTaskKey}
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
                                    backgroundColor={`${getColorScheme(
                                        point
                                    )}.100`}
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
                                        {`• L${
                                            sortedSerieIds.indexOf(
                                                point.serieId
                                            ) + 1
                                        }`}
                                    </Text>
                                </HStack>
                            </>
                        )}
                    </HStack>
                    <Text fontSize="xs">{point.y.toFixed(2)}</Text>
                </ListItem>
            ))}
        </List>
    );
};

export default PerfChartTooltip;
