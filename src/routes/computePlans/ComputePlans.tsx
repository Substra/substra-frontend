import {
    VStack,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Box,
    Button,
    HStack,
    Text,
    Progress,
    Flex,
    Skeleton,
} from '@chakra-ui/react';
import { useLocation } from 'wouter';

import { listComputePlans } from '@/modules/computePlans/ComputePlansSlice';
import {
    ComputePlanStatus,
    ComputePlanT,
} from '@/modules/computePlans/ComputePlansTypes';

import { formatDate } from '@/libs/utils';

import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersEffect,
} from '@/hooks';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useLocationWithParams from '@/hooks/useLocationWithParams';
import useSelection from '@/hooks/useSelection';

import { compilePath, PATHS } from '@/routes';

import Checkbox from '@/components/Checkbox';
import SearchBar from '@/components/SearchBar';
import Status from '@/components/Status';
import { ClickableTr, EmptyTr, TableSkeleton } from '@/components/Table';
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
        setLocationWithParams,
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
                            <Th>&nbsp;</Th>
                            <Th>Tag</Th>
                            <Th>Status / Tasks</Th>
                            <Th width="100%">Creation</Th>
                        </Tr>
                    </Thead>
                    <Tbody data-cy={computePlansLoading ? 'loading' : 'loaded'}>
                        {!computePlansLoading && computePlans.length === 0 && (
                            <EmptyTr nbColumns={4} />
                        )}
                        {computePlansLoading ? (
                            <TableSkeleton
                                itemCount={computePlansCount}
                                currentPage={page}
                            >
                                <Td>
                                    <Skeleton width="16px" height="16px" />
                                </Td>
                                <Td>
                                    <Skeleton>
                                        <Flex
                                            alignItems="center"
                                            justifyContent="space-between"
                                        >
                                            <Status
                                                status={ComputePlanStatus.done}
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
                                            marginTop="2"
                                            borderRadius="8"
                                            hasStripe={false}
                                            value={100}
                                        />
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
                            </TableSkeleton>
                        ) : (
                            computePlans.map((computePlan) => (
                                <ClickableTr
                                    key={computePlan.key}
                                    onClick={() =>
                                        setLocationWithParams(
                                            compilePath(
                                                PATHS.COMPUTE_PLAN_TASKS,
                                                {
                                                    key: computePlan.key,
                                                }
                                            )
                                        )
                                    }
                                >
                                    <Td>
                                        <Checkbox
                                            value={computePlan.key}
                                            checked={selectedKeys.includes(
                                                computePlan.key
                                            )}
                                            onChange={onSelectionChange(
                                                computePlan.key
                                            )}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </Td>
                                    <Td maxWidth="350px">
                                        <Text fontSize="xs">
                                            {computePlan.tag}
                                        </Text>
                                    </Td>
                                    <Td minWidth="255px">
                                        <Flex
                                            alignItems="center"
                                            justifyContent="space-between"
                                        >
                                            <Status
                                                status={computePlan.status}
                                                size="sm"
                                            />
                                            <Text
                                                fontSize="xs"
                                                color="gray.600"
                                            >
                                                {computePlan.done_count}/
                                                {computePlan.task_count}
                                            </Text>
                                        </Flex>
                                        <Progress
                                            size="xs"
                                            colorScheme="teal"
                                            marginTop="2"
                                            borderRadius="8"
                                            hasStripe={
                                                computePlan.done_count !==
                                                computePlan.task_count
                                            }
                                            value={
                                                (computePlan.done_count /
                                                    computePlan.task_count) *
                                                100
                                            }
                                        />
                                    </Td>
                                    <Td>
                                        <Text fontSize="xs">
                                            {formatDate(
                                                computePlan.creation_date
                                            )}
                                        </Text>
                                    </Td>
                                </ClickableTr>
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
