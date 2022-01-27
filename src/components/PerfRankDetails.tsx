import { useContext } from 'react';

import IconTag from './IconTag';
import {
    Box,
    Button,
    Heading,
    HStack,
    Icon,
    List,
    Flex,
    ListItem,
    Text,
    Tooltip,
} from '@chakra-ui/react';
import { RiArrowRightSLine, RiGitCommitLine, RiLockLine } from 'react-icons/ri';
import { Link } from 'wouter';

import { isAverageNode } from '@/modules/nodes/NodesUtils';
import { SerieT } from '@/modules/series/SeriesTypes';
import { average, getLineId, getMaxRank } from '@/modules/series/SeriesUtils';
import { TaskCategory } from '@/modules/tasks/TuplesTypes';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import usePerfBrowserColors from '@/hooks/usePerfBrowserColors';

import { compilePath, PATHS, TASK_CATEGORY_SLUGS } from '@/routes';

const AverageListItem = ({
    label,
    perf,
}: {
    label: string;
    perf: string;
}): JSX.Element => (
    <ListItem>
        <Flex
            justifyContent="space-between"
            alignItems="center"
            paddingX="5"
            height="10"
        >
            <HStack spacing="2.5">
                <IconTag
                    icon={RiGitCommitLine}
                    backgroundColor="black.100"
                    fill="black.500"
                />
                <Text fontSize="xs" fontWeight="semibold">
                    {label}
                </Text>
            </HStack>
            <Text fontSize="xs" paddingRight="18px">
                {perf}
            </Text>
        </Flex>
    </ListItem>
);

interface PerfRankDetailsProps {
    series: SerieT[];
    hoveredRank: number | null;
    selectedRank: number | null;
    setHighlightedSerie: (
        highlightedSerie: { id: number; computePlanKey: string } | undefined
    ) => void;
}
const PerfRankDetails = ({
    series,
    hoveredRank,
    selectedRank,
    setHighlightedSerie,
}: PerfRankDetailsProps): JSX.Element => {
    const { sortedComputePlanKeys, displayAverage } =
        useContext(PerfBrowserContext);
    const lineId = getLineId(series);
    const { getColorScheme } = usePerfBrowserColors();

    const getRankData = (
        rank: number
    ): {
        id: number;
        computePlanKey: string;
        testTaskKey?: string;
        cpId: string;
        lineId: string;
        worker: string;
        perf: string;
    }[] => {
        return series.map((serie) => {
            const point = serie.points.find((p) => p.rank === rank);

            let perf = 'N/A';
            if (point?.perf) {
                perf = point.perf.toFixed(2);
            }

            return {
                id: serie.id,
                computePlanKey: serie.computePlanKey,
                testTaskKey: point?.testTaskKey,
                cpId: `CP${
                    sortedComputePlanKeys.indexOf(serie.computePlanKey) + 1
                }`,
                lineId: `L${lineId(serie.id)}`,
                worker: serie.worker,
                perf,
            };
        });
    };

    const getAveragePerf = (rank: number): string => {
        if (displayAverage) {
            const rankPerformances = series
                .map((serie) => serie.points.find((p) => p.rank === rank))
                .map((point) => point?.perf)
                .filter(
                    (perf): perf is number =>
                        perf !== undefined && perf !== null
                );

            if (rankPerformances.length === series.length) {
                return average(rankPerformances).toFixed(2);
            }
        }

        return 'N/A';
    };

    let rankData = [];
    let averagePerf = 'N/A';
    if (selectedRank !== null) {
        rankData = getRankData(selectedRank);
        averagePerf = getAveragePerf(selectedRank);
    } else if (hoveredRank !== null) {
        rankData = getRankData(hoveredRank);
        averagePerf = getAveragePerf(hoveredRank);
    } else {
        const maxRank = getMaxRank(series);
        rankData = getRankData(maxRank);
        averagePerf = getAveragePerf(maxRank);
    }

    return (
        <Box
            backgroundColor="white"
            width="300px"
            flexGrow={0}
            flexShrink={0}
            paddingY="5"
        >
            <Heading
                size="xxs"
                fontWeight="bold"
                textTransform="uppercase"
                marginBottom="5"
                display="flex"
                alignItems="center"
                paddingX="5"
            >
                {selectedRank !== null && (
                    <>
                        {`Rank ${selectedRank}`}
                        <Icon as={RiLockLine} marginLeft="1" />
                    </>
                )}
                {selectedRank === null &&
                    hoveredRank !== null &&
                    `Rank ${hoveredRank}`}
                {selectedRank === null && hoveredRank === null && 'Last rank'}
            </Heading>
            <List>
                {displayAverage && (
                    <AverageListItem label="Average" perf={averagePerf} />
                )}
                {rankData
                    .filter(({ worker }) => isAverageNode(worker))
                    .map(({ worker, perf, id, computePlanKey }) => (
                        <AverageListItem
                            key={`${computePlanKey}-${id}`}
                            label={worker}
                            perf={perf}
                        />
                    ))}
                {rankData
                    .filter(({ worker }) => !isAverageNode(worker))
                    .map(
                        ({
                            id,
                            cpId,
                            lineId,
                            worker,
                            perf,
                            computePlanKey,
                            testTaskKey,
                        }) => (
                            <ListItem
                                key={`${computePlanKey}-${id}`}
                                onMouseEnter={() =>
                                    setHighlightedSerie({ id, computePlanKey })
                                }
                                onMouseLeave={() =>
                                    setHighlightedSerie(undefined)
                                }
                            >
                                <Link
                                    href={
                                        testTaskKey
                                            ? compilePath(PATHS.TASK, {
                                                  key: testTaskKey,
                                                  category:
                                                      TASK_CATEGORY_SLUGS[
                                                          TaskCategory.test
                                                      ],
                                              })
                                            : ''
                                    }
                                >
                                    <Button
                                        as="a"
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        variant="ghost"
                                        target="_blank"
                                        paddingX="5"
                                    >
                                        <HStack spacing="2.5">
                                            <IconTag
                                                icon={RiGitCommitLine}
                                                backgroundColor={`${getColorScheme(
                                                    {
                                                        worker,
                                                        computePlanKey,
                                                    }
                                                )}.100`}
                                                fill={`${getColorScheme({
                                                    worker,
                                                    computePlanKey,
                                                })}.500`}
                                            />
                                            <Tooltip
                                                label={
                                                    sortedComputePlanKeys.length >
                                                    1
                                                        ? `${cpId} • ${worker} • ${lineId}`
                                                        : `${worker} • ${lineId}`
                                                }
                                                placement="top"
                                            >
                                                <HStack spacing="1">
                                                    <Text
                                                        fontSize="xs"
                                                        fontWeight="semibold"
                                                        maxWidth="150px"
                                                        isTruncated
                                                    >
                                                        {sortedComputePlanKeys.length >
                                                        1
                                                            ? `${cpId} • ${worker}`
                                                            : worker}
                                                    </Text>
                                                    <Text
                                                        as="span"
                                                        fontSize="xs"
                                                        fontWeight="normal"
                                                    >
                                                        {`• ${lineId}`}
                                                    </Text>
                                                </HStack>
                                            </Tooltip>
                                        </HStack>
                                        <HStack spacing="1">
                                            <Text
                                                fontSize="xs"
                                                fontWeight="normal"
                                            >
                                                {perf}
                                            </Text>
                                            <Icon
                                                as={RiArrowRightSLine}
                                                width="14px"
                                                height="14px"
                                            />
                                        </HStack>
                                    </Button>
                                </Link>
                            </ListItem>
                        )
                    )}
            </List>
        </Box>
    );
};
export default PerfRankDetails;
