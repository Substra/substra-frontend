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
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

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
import {
    CreationDateSkeletonTd,
    CreationDateTd,
} from '@/components/CreationDateTableCells';
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
        <Box width="100%">
            <VStack
                padding="6"
                marginBottom="2.5"
                spacing="2.5"
                alignItems="flex-start"
                width="100%"
                bg="white"
            >
                <Flex width="100%" justifyContent="space-between">
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
                                ? 'Select compute plans to Compare'
                                : `Compare ${selectedKeys.length} compute plans`}
                        </Button>
                    </HStack>
                </Flex>
                <TableFilterTags asset="compute_plan">
                    <StatusTableFilterTag />
                </TableFilterTags>
                <Box
                    backgroundColor="white"
                    width="100%"
                    borderStyle="solid"
                    borderColor="gray.100"
                >
                    <Table
                        height={`calc(100vh - 190px)`}
                        size="md"
                        overflowX="auto"
                        overflowY="auto"
                        display="block"
                    >
                        <Thead
                            position="sticky"
                            top={0}
                            backgroundColor="white"
                            zIndex={1}
                        >
                            <Tr>
                                <Th>&nbsp;</Th>
                                <Th>Creation date</Th>
                                <Th>Tag</Th>
                                <Th>Status</Th>
                                <Th>Tasks</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {!computePlansLoading &&
                                computePlans.length === 0 && (
                                    <EmptyTr nbColumns={5} />
                                )}
                            {computePlansLoading ? (
                                <TableSkeleton
                                    itemCount={computePlansCount}
                                    currentPage={page}
                                    rowHeight="73px"
                                >
                                    <Td>
                                        <Skeleton width="16px" height="16px" />
                                    </Td>
                                    <Td>
                                        <Skeleton>
                                            <Text fontSize="sm">
                                                Lorem ipsum dolor sit amet
                                            </Text>
                                        </Skeleton>
                                    </Td>
                                    <CreationDateSkeletonTd />
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
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            />
                                        </Td>
                                        <Td maxWidth="350px">
                                            <Text size="sm">
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
                                                marginY="2"
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
                                        <CreationDateTd
                                            creationDate={
                                                computePlan.creation_date
                                            }
                                        />
                                    </ClickableTr>
                                ))
                            )}
                        </Tbody>
                    </Table>
                </Box>
                <TablePagination
                    currentPage={page}
                    itemCount={computePlansCount}
                />
            </VStack>
        </Box>
    );
};

export default ComputePlans;
