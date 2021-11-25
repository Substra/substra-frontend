import { useContext } from 'react';

import IconTag from './IconTag';
import {
    Box,
    Flex,
    Heading,
    HStack,
    Icon,
    List,
    ListItem,
    Text,
} from '@chakra-ui/react';
import { RiArrowRightSLine, RiGitCommitLine } from 'react-icons/ri';

import { SerieT } from '@/modules/series/SeriesTypes';
import { getMaxRank } from '@/modules/series/SeriesUtils';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

interface PerfRankDetailsProps {
    series: SerieT[];
    rank?: number;
    setHighlightedSerie: (
        highlightedSerie: { id: number; computePlanKey: string } | undefined
    ) => void;
}
const PerfRankDetails = ({
    series,
    rank,
    setHighlightedSerie,
}: PerfRankDetailsProps): JSX.Element => {
    const { computePlans } = useContext(PerfBrowserContext);

    const computePlanKeys = computePlans.map((computePlan) => computePlan.key);
    computePlanKeys.sort();

    const maxRank = getMaxRank(series);

    const getRankData = (): {
        id: number;
        computePlanKey: string;
        cpId: string;
        worker: string;
        perf: string;
    }[] => {
        if (!rank) {
            return series.map((serie) => {
                const lastPoint = serie.points[serie.points.length - 1];

                let perf = 'N/A';
                if (lastPoint.rank === maxRank && lastPoint.perf !== null) {
                    perf = lastPoint.perf.toFixed(2);
                }

                return {
                    id: serie.id,
                    computePlanKey: serie.computePlanKey,
                    cpId: `CP${
                        computePlanKeys.indexOf(serie.computePlanKey) + 1
                    }`,
                    worker: serie.worker,
                    perf,
                };
            });
        }
        return [];
    };
    const rankData = getRankData();

    return (
        <Box
            backgroundColor="white"
            width="300px"
            flexGrow={0}
            flexShrink={0}
            padding="5"
        >
            <Heading
                size="xxs"
                fontWeight="bold"
                textTransform="uppercase"
                marginBottom="5"
            >
                Last rank
            </Heading>
            <List>
                {rankData.map(({ id, cpId, worker, perf, computePlanKey }) => (
                    <ListItem
                        key={id}
                        paddingY="2.5"
                        onMouseEnter={() =>
                            setHighlightedSerie({ id, computePlanKey })
                        }
                        onMouseLeave={() => setHighlightedSerie(undefined)}
                    >
                        <Flex
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <HStack spacing="2.5">
                                <IconTag
                                    icon={RiGitCommitLine}
                                    backgroundColor="teal.100"
                                    fill="teal.500"
                                />
                                <HStack spacing="1">
                                    <Text fontSize="xs" fontWeight="semibold">
                                        {`${cpId} • ${worker}`}
                                    </Text>
                                    <Text as="span" fontSize="xs">
                                        {`• L${id}`}
                                    </Text>
                                </HStack>
                            </HStack>
                            <Text fontSize="xs">
                                {perf}
                                <Icon as={RiArrowRightSLine} />
                            </Text>
                        </Flex>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};
export default PerfRankDetails;
