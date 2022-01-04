import ComputePlanTr from './components/ComputePlanTr';
import {
    VStack,
    Table,
    Thead,
    Tr,
    Th,
    Td,
    Tbody as ChakraTbody,
    Box,
    Button,
    HStack,
    Text,
    Flex,
    Skeleton,
    Progress,
} from '@chakra-ui/react';
import { useLocation } from 'wouter';

import { listComputePlans } from '@/modules/computePlans/ComputePlansSlice';
import {
    ComputePlanStatus,
    ComputePlanT,
} from '@/modules/computePlans/ComputePlansTypes';

import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersEffect,
} from '@/hooks';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useLocationWithParams from '@/hooks/useLocationWithParams';
import usePinnedComputePlans from '@/hooks/usePinnedComputePlans';
import useSelection from '@/hooks/useSelection';

import { compilePath, PATHS } from '@/routes';

import SearchBar from '@/components/SearchBar';
import Status from '@/components/Status';
import { EmptyTr, TableSkeleton, Tbody } from '@/components/Table';
import {
    StatusTableFilterTag,
    TableFilterTags,
} from '@/components/TableFilterTags';
import {
    TableFilters,
    ComputePlanStatusTableFilter,
} from '@/components/TableFilters';
import TablePagination from '@/components/TablePagination';

const ComputePlans = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const {
        params: { page, search: searchFilters },
    } = useLocationWithParams();
    const [, setLocation] = useLocation();

    useSearchFiltersEffect(() => {
        dispatch(listComputePlans({ filters: searchFilters, page }));
    }, [searchFilters, page]);

    const computePlans: ComputePlanT[] = useAppSelector(
        (state) => state.computePlans.computePlans
    );

    const computePlansLoading = useAppSelector(
        (state) => state.computePlans.computePlansLoading
    );

    const computePlansCount = useAppSelector(
        (state) => state.computePlans.computePlansCount
    );

    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle('Compute plans list'),
        []
    );

    const [selectedKeys, onSelectionChange, resetSelection] = useSelection();

    const onClear = () => {
        resetSelection();
    };

    const onCompare = () => {
        setLocation(
            compilePath(PATHS.COMPARE, { keys: selectedKeys.join(',') })
        );
    };

    const { pinnedItems, pinItem, unpinItem } = usePinnedComputePlans();
    const pinnedKeys = pinnedItems.map((cp) => cp.key);

    const onPinChange = (computePlan: ComputePlanT) => () => {
        if (pinnedKeys.includes(computePlan.key)) {
            unpinItem(computePlan);
        } else {
            pinItem(computePlan);
        }
    };

    return (
        <VStack
            paddingY="5"
            spacing="2.5"
            alignItems="stretch"
            width="100%"
            bg="white"
            flexGrow={1}
            alignSelf="stretch"
            overflow="hidden"
        >
            <Flex justifyContent="space-between" paddingX="6">
                <HStack spacing="2.5">
                    <TableFilters asset="compute_plan">
                        <ComputePlanStatusTableFilter />
                    </TableFilters>
                    <SearchBar asset="compute_plan" />
                </HStack>
                <HStack spacing="4">
                    {selectedKeys.length > 0 && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={onClear}
                            disabled={selectedKeys.length === 0}
                        >
                            Clear
                        </Button>
                    )}
                    <Button
                        marginLeft={16}
                        size="sm"
                        colorScheme="teal"
                        onClick={onCompare}
                        disabled={selectedKeys.length < 2}
                    >
                        {selectedKeys.length < 2
                            ? 'Select compute plans to compare'
                            : `Compare ${selectedKeys.length} compute plans`}
                    </Button>
                </HStack>
            </Flex>
            <Box paddingX="6">
                <TableFilterTags asset="compute_plan">
                    <StatusTableFilterTag />
                </TableFilterTags>
            </Box>
            <Box flexGrow={1} overflow="auto">
                <Table size="md">
                    <Thead
                        position="sticky"
                        top={0}
                        backgroundColor="white"
                        zIndex={1}
                    >
                        <Tr>
                            <Th padding="0" minWidth="50px"></Th>
                            <Th padding="0" minWidth="36px"></Th>
                            <Th minWidth="250px">Tag</Th>
                            <Th minWidth="255px">Status / Tasks</Th>
                            <Th minWidth="255px">Creation</Th>
                            <Th minWidth="255px">Dates / Duration</Th>
                        </Tr>
                    </Thead>
                    <ChakraTbody>
                        {pinnedItems.map((computePlan) => (
                            <ComputePlanTr
                                key={computePlan.key}
                                computePlan={computePlan}
                                selectedKeys={selectedKeys}
                                onSelectionChange={onSelectionChange}
                                pinnedKeys={pinnedKeys}
                                onPinChange={onPinChange}
                            />
                        ))}
                    </ChakraTbody>
                    <Tbody data-cy={computePlansLoading ? 'loading' : 'loaded'}>
                        {!computePlansLoading && computePlans.length === 0 && (
                            <EmptyTr nbColumns={6} asset="compute_plan" />
                        )}
                        {computePlansLoading ? (
                            <TableSkeleton
                                itemCount={computePlansCount}
                                currentPage={page}
                            >
                                <Td paddingRight="2.5">
                                    <Skeleton width="16px" height="16px" />
                                </Td>
                                <Td paddingX="2.5">
                                    <Skeleton width="16px" height="16px" />
                                </Td>
                                <Td>
                                    <Skeleton>
                                        <VStack spacing="1">
                                            <Flex
                                                alignItems="center"
                                                justifyContent="space-between"
                                            >
                                                <Status
                                                    status={
                                                        ComputePlanStatus.done
                                                    }
                                                    size="sm"
                                                />
                                                <Text
                                                    fontSize="xs"
                                                    color="gray.600"
                                                >
                                                    foo/bar
                                                </Text>
                                            </Flex>
                                            <Progress
                                                size="xs"
                                                colorScheme="teal"
                                                hasStripe={false}
                                                value={100}
                                            />
                                        </VStack>
                                    </Skeleton>
                                </Td>
                                <Td>
                                    <Skeleton>
                                        <Text fontSize="xs" whiteSpace="nowrap">
                                            Lorem ipsum dolor sit amet
                                        </Text>
                                    </Skeleton>
                                </Td>
                                <Td>
                                    <Skeleton>
                                        <Text fontSize="xs">
                                            YYYY-MM-DD HH:MM:SS
                                        </Text>
                                    </Skeleton>
                                </Td>
                                <Td>
                                    <Skeleton>
                                        <Text fontSize="xs">
                                            YYYY-MM-DD HH:MM:SS
                                        </Text>
                                    </Skeleton>
                                </Td>
                            </TableSkeleton>
                        ) : (
                            computePlans
                                .filter(
                                    (computePlan) =>
                                        !pinnedKeys.includes(computePlan.key)
                                )
                                .map((computePlan) => (
                                    <ComputePlanTr
                                        key={computePlan.key}
                                        computePlan={computePlan}
                                        selectedKeys={selectedKeys}
                                        onSelectionChange={onSelectionChange}
                                        pinnedKeys={pinnedKeys}
                                        onPinChange={onPinChange}
                                    />
                                ))
                        )}
                    </Tbody>
                </Table>
            </Box>
            <Box paddingX="6">
                <TablePagination
                    currentPage={page}
                    itemCount={computePlansCount}
                />
            </Box>
        </VStack>
    );
};

export default ComputePlans;
