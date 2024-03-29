import { useContext } from 'react';

import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Icon,
    ListItem,
    Text,
    Tooltip,
} from '@chakra-ui/react';
import { RiArrowRightSLine, RiLockLine } from 'react-icons/ri';

import { PerfBrowserContext } from '@/features/perfBrowser/usePerfBrowser';
import { capitalize } from '@/libs/utils';
import { SerieRankDataT } from '@/types/SeriesTypes';

import PerfIconTag from '@/components/PerfIconTag';

export const PerfSidebarContainer = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => {
    const { selectedIdentifier, selectedRank, hoveredRank, xAxisMode } =
        useContext(PerfBrowserContext);
    return (
        <Box padding="6">
            <Heading
                size="xxs"
                fontWeight="bold"
                textTransform="uppercase"
                display="flex"
                justifyContent="space-between"
                paddingBottom={4}
            >
                <Text>{title}</Text>
                {selectedIdentifier && (
                    <HStack color="gray.400" spacing="1">
                        <Text>
                            {selectedRank !== null &&
                                `${capitalize(xAxisMode)} ${selectedRank}`}
                            {selectedRank === null &&
                                hoveredRank !== null &&
                                `${capitalize(xAxisMode)} ${hoveredRank}`}
                            {selectedRank === null &&
                                hoveredRank === null &&
                                `Last ${xAxisMode}`}
                        </Text>
                        {selectedRank !== null && <Icon as={RiLockLine} />}
                    </HStack>
                )}
            </Heading>
            {children}
        </Box>
    );
};

export const OrganizationListItem = ({
    organizationId,
    computePlanKey,
}: {
    organizationId: string;
    computePlanKey: string;
}) => {
    const {
        getOrganizationIndex,
        setHighlightedOrganizationId,
        setHighlightedComputePlanKey,
    } = useContext(PerfBrowserContext);
    return (
        <ListItem
            display="flex"
            alignItems="center"
            height="10"
            onMouseEnter={() => {
                setHighlightedOrganizationId(organizationId);
                setHighlightedComputePlanKey(computePlanKey);
            }}
            onMouseLeave={() => {
                setHighlightedOrganizationId(undefined);
                setHighlightedComputePlanKey(undefined);
            }}
        >
            <HStack spacing="2.5" alignItems="center">
                <PerfIconTag
                    worker={organizationId}
                    computePlanKey={computePlanKey}
                />
                <Tooltip
                    label={`#${getOrganizationIndex(
                        computePlanKey,
                        organizationId
                    )} • ${organizationId}`}
                    placement="top"
                >
                    <HStack spacing="1">
                        <Text
                            as="span"
                            fontSize="xs"
                            fontWeight="normal"
                            maxWidth="250px"
                            noOfLines={1}
                        >
                            <Text as="span" fontWeight="semibold">
                                {`#${getOrganizationIndex(
                                    computePlanKey,
                                    organizationId
                                )} • `}
                            </Text>
                            {organizationId}
                        </Text>
                    </HStack>
                </Tooltip>
            </HStack>
        </ListItem>
    );
};

export const SerieListItem = ({
    serieRankData,
}: {
    serieRankData: SerieRankDataT;
}) => {
    const { setHighlightedSerie, setDrawerTestTaskKey, getSerieIndex } =
        useContext(PerfBrowserContext);

    const content = (
        <>
            <HStack spacing="2.5" alignItems="center">
                <PerfIconTag
                    worker={serieRankData.worker}
                    computePlanKey={serieRankData.computePlanKey}
                />
                <Tooltip
                    label={`#${getSerieIndex(
                        serieRankData.computePlanKey,
                        serieRankData.id
                    )} • ${serieRankData.worker}`}
                    placement="top"
                >
                    <HStack spacing="1">
                        <Text
                            as="span"
                            fontSize="xs"
                            fontWeight="normal"
                            maxWidth="190px"
                            noOfLines={1}
                        >
                            <Text as="span" fontWeight="semibold">
                                {`#${getSerieIndex(
                                    serieRankData.computePlanKey,
                                    serieRankData.id
                                )} • `}
                            </Text>
                            {serieRankData.worker}
                        </Text>
                    </HStack>
                </Tooltip>
            </HStack>
            <HStack spacing="1">
                <Text fontSize="xs" fontWeight="normal">
                    {serieRankData.perf}
                </Text>
                {serieRankData.testTaskKey ? (
                    <Icon as={RiArrowRightSLine} width="14px" height="14px" />
                ) : (
                    <Box width="14px" height="14px" />
                )}
            </HStack>
        </>
    );

    return (
        <ListItem
            onMouseEnter={() =>
                setHighlightedSerie({
                    id: serieRankData.id,
                    computePlanKey: serieRankData.computePlanKey,
                })
            }
            onMouseLeave={() => setHighlightedSerie(undefined)}
        >
            {serieRankData.testTaskKey ? (
                <Button
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    variant="ghost"
                    paddingX="5"
                    cursor="pointer"
                    width="100%"
                    onClick={() =>
                        setDrawerTestTaskKey(serieRankData.testTaskKey)
                    }
                >
                    {content}
                </Button>
            ) : (
                <Flex
                    paddingX="5"
                    height="10"
                    justifyContent="space-between"
                    alignItems="center"
                >
                    {content}
                </Flex>
            )}
        </ListItem>
    );
};
