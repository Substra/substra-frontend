import { useContext, useState } from 'react';

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
import { RiArrowRightSLine, RiLockLine } from 'react-icons/ri';

import { isAverageNode } from '@/modules/nodes/NodesUtils';
import { SerieT } from '@/modules/series/SeriesTypes';
import {
    getLineId,
    getMaxEpoch,
    getMaxRank,
} from '@/modules/series/SeriesUtils';
import { TaskCategory } from '@/modules/tasks/TuplesTypes';

import { capitalize } from '@/libs/utils';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

import TaskDrawer from '@/routes/tasks/components/TaskDrawer';

import PerfIconTag from '@/components/PerfIconTag';

const AverageListItem = ({
    worker,
    computePlanKey,
    label,
    perf,
    onMouseEnter,
    onMouseLeave,
}: {
    worker: string;
    computePlanKey: string;
    label: string;
    perf: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}): JSX.Element => (
    <ListItem onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <Flex
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            paddingX="5"
            height="10"
            _hover={{ bg: 'gray.100' }}
        >
            <HStack spacing="2.5">
                <PerfIconTag worker={worker} computePlanKey={computePlanKey} />
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
}
const PerfRankDetails = ({ series }: PerfRankDetailsProps): JSX.Element => {
    const {
        sortedComputePlanKeys,
        xAxisMode,
        hoveredRank,
        selectedRank,
        setHighlightedSerie,
    } = useContext(PerfBrowserContext);
    const lineId = getLineId(series);
    const [drawerTestTaskKey, setDrawerTestTaskKey] = useState<
        string | undefined
    >(undefined);

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
            // Look for rank or epoch based on X axis mode
            const point = serie.points.find((p) => p[xAxisMode] === rank);

            let perf = 'N/A';
            if (point?.perf) {
                perf = point.perf.toFixed(3);
            }

            return {
                id: serie.id,
                computePlanKey: serie.computePlanKey,
                testTaskKey: point?.testTaskKey,
                cpId: `#${
                    sortedComputePlanKeys.indexOf(serie.computePlanKey) + 1
                }`,
                lineId: `L${lineId(serie.id)}`,
                worker: serie.worker,
                perf,
            };
        });
    };

    let rankData = [];
    if (selectedRank !== null) {
        rankData = getRankData(selectedRank);
    } else if (hoveredRank !== null) {
        rankData = getRankData(hoveredRank);
    } else {
        const max =
            xAxisMode === 'rank' ? getMaxRank(series) : getMaxEpoch(series);
        rankData = getRankData(max);
    }

    const handleOnclick = (taskKey: string | undefined) => {
        setDrawerTestTaskKey(taskKey);
    };

    return (
        <Box
            backgroundColor="white"
            width="300px"
            flexGrow={0}
            flexShrink={0}
            overflowY="auto"
            position="relative"
        >
            <TaskDrawer
                category={TaskCategory.test}
                taskKey={drawerTestTaskKey}
                onClose={() => setDrawerTestTaskKey(undefined)}
                setPageTitle={false}
            />
            <Heading
                size="xxs"
                fontWeight="bold"
                textTransform="uppercase"
                display="flex"
                alignItems="center"
                padding="5"
                position="sticky"
                top="0"
                backgroundColor="white"
                zIndex="docked"
            >
                {selectedRank !== null && (
                    <>
                        {`${capitalize(xAxisMode)} ${selectedRank}`}
                        <Icon as={RiLockLine} marginLeft="1" />
                    </>
                )}
                {selectedRank === null &&
                    hoveredRank !== null &&
                    `${capitalize(xAxisMode)} ${hoveredRank}`}
                {selectedRank === null &&
                    hoveredRank === null &&
                    `Last ${xAxisMode}`}
            </Heading>
            <List>
                {rankData
                    .filter(({ worker }) => isAverageNode(worker))
                    .map(({ worker, perf, id, computePlanKey }) => (
                        <AverageListItem
                            key={`${computePlanKey}-${id}`}
                            worker={worker}
                            computePlanKey={computePlanKey}
                            label={worker}
                            perf={perf}
                            onMouseEnter={() =>
                                setHighlightedSerie({ id, computePlanKey })
                            }
                            onMouseLeave={() => setHighlightedSerie(undefined)}
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
                                <Button
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    variant="ghost"
                                    paddingX="5"
                                    cursor="pointer"
                                    width="100%"
                                    onClick={() => handleOnclick(testTaskKey)}
                                >
                                    <HStack spacing="2.5">
                                        <PerfIconTag
                                            worker={worker}
                                            computePlanKey={computePlanKey}
                                        />
                                        <Tooltip
                                            label={
                                                sortedComputePlanKeys.length > 1
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
                                        <Text fontSize="xs" fontWeight="normal">
                                            {perf}
                                        </Text>
                                        <Icon
                                            as={RiArrowRightSLine}
                                            width="14px"
                                            height="14px"
                                        />
                                    </HStack>
                                </Button>
                            </ListItem>
                        )
                    )}
            </List>
        </Box>
    );
};
export default PerfRankDetails;
