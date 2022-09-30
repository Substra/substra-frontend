import { useEffect } from 'react';

import { AsyncThunkAction } from '@reduxjs/toolkit';
import { Link } from 'wouter';

import {
    Flex,
    VStack,
    Thead,
    Tr,
    Td,
    Box,
    Text,
    Skeleton,
    HStack,
    Link as ChakraLink,
    TableProps,
} from '@chakra-ui/react';

import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import { useSetLocationPreserveParams } from '@/hooks/useLocationWithParams';
import {
    useCreationDate,
    useDuration,
    useEndDate,
    useMatch,
    useOrdering,
    usePage,
    useStartDate,
    useStatus,
    useWorker,
} from '@/hooks/useSyncedState';
import {
    TableFiltersContext,
    useTableFiltersContext,
} from '@/hooks/useTableFilters';
import { PaginatedApiResponseT } from '@/modules/common/CommonTypes';
import { RetrieveComputePlanTasksArgsProps } from '@/modules/computePlans/ComputePlansSlice';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { ListTasksProps } from '@/modules/tasks/TasksSlice';
import { TupleT, TupleStatus } from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS } from '@/paths';

import { AssetsTable } from '@/components/AssetsTable';
import Duration from '@/components/Duration';
import OrderingTh from '@/components/OrderingTh';
import RefreshButton from '@/components/RefreshButton';
import SearchBar from '@/components/SearchBar';
import Status from '@/components/Status';
import { ClickableTr, EmptyTr, TableSkeleton, Tbody } from '@/components/Table';
import {
    DateFilterTag,
    DurationFilterTag,
    StatusTableFilterTag,
    TableFilterTags,
    WorkerTableFilterTag,
} from '@/components/TableFilterTags';
import {
    CreationDateTableFilter,
    DurationTableFilter,
    EndDateTableFilter,
    StartDateTableFilter,
    TableFilters,
    TaskStatusTableFilter,
    WorkerTableFilter,
} from '@/components/TableFilters';
import TablePagination from '@/components/TablePagination';
import Timing from '@/components/Timing';

type TasksTableProps = {
    loading: boolean;
    list: () => AsyncThunkAction<
        PaginatedApiResponseT<TupleT>,
        RetrieveComputePlanTasksArgsProps | ListTasksProps,
        { rejectValue: string }
    >;
    tasks: TupleT[];
    count: number;
    computePlan?: ComputePlanT | null;
    tableProps?: TableProps;
};

const TasksTable = ({
    loading,
    list,
    tasks,
    count,
    computePlan,
    tableProps,
}: TasksTableProps): JSX.Element => {
    const [page] = usePage();
    const [match] = useMatch();
    const [ordering] = useOrdering('-rank');
    const [status] = useStatus();
    const [worker] = useWorker();
    const { creationDateBefore, creationDateAfter } = useCreationDate();
    const { startDateBefore, startDateAfter } = useStartDate();
    const { endDateBefore, endDateAfter } = useEndDate();
    const { durationMin, durationMax } = useDuration();
    const setLocationPreserveParams = useSetLocationPreserveParams();

    const dispatchWithAutoAbort = useDispatchWithAutoAbort();
    useEffect(() => {
        const action = list();
        if (action) {
            return dispatchWithAutoAbort(action);
        }
        // The computePlan is needed to trigger a list call once it has been fetched
    }, [
        dispatchWithAutoAbort,
        list,
        page,
        computePlan,
        ordering,
        match,
        status,
        worker,
        creationDateAfter,
        creationDateBefore,
        startDateAfter,
        startDateBefore,
        endDateAfter,
        endDateBefore,
        durationMin,
        durationMax,
    ]);

    const context = useTableFiltersContext('tuple');
    const { onPopoverOpen } = context;

    return (
        <TableFiltersContext.Provider value={context}>
            <Flex justifyContent="space-between" width="100%">
                <HStack spacing="2.5">
                    <TableFilters>
                        <TaskStatusTableFilter />
                        <WorkerTableFilter />
                        <CreationDateTableFilter />
                        <StartDateTableFilter />
                        <EndDateTableFilter />
                        <DurationTableFilter />
                    </TableFilters>
                    <SearchBar placeholder="Search key..." />
                </HStack>
                <RefreshButton
                    loading={loading}
                    dispatchWithAutoAbort={dispatchWithAutoAbort}
                    actionBuilder={list}
                />
            </Flex>
            <TableFilterTags>
                <StatusTableFilterTag />
                <WorkerTableFilterTag />
                <DateFilterTag urlParam="creation_date" label="Creation date" />
                <DateFilterTag urlParam="start_date" label="Start date" />
                <DateFilterTag urlParam="end_date" label="End date" />
                <DurationFilterTag />
            </TableFilterTags>
            <Box>
                <VStack display="inline-block" spacing="2.5">
                    <Box
                        backgroundColor="white"
                        borderWidth="1px"
                        borderStyle="solid"
                        borderColor="gray.100"
                    >
                        <AssetsTable {...tableProps}>
                            <Thead>
                                <Tr>
                                    <OrderingTh
                                        width="140px"
                                        openFilters={() => onPopoverOpen(0)}
                                        options={[
                                            {
                                                label: 'Status',
                                                desc: {
                                                    label: 'Sort status A -> Z',
                                                    value: 'status',
                                                },
                                                asc: {
                                                    label: 'Sort status Z -> A',
                                                    value: '-status',
                                                },
                                            },
                                        ]}
                                    />
                                    <OrderingTh
                                        options={[
                                            {
                                                label: 'Worker',
                                                asc: {
                                                    label: 'Sort worker Z -> A',
                                                    value: '-worker',
                                                },
                                                desc: {
                                                    label: 'Sort worker A -> Z',
                                                    value: 'worker',
                                                },
                                            },
                                            {
                                                label: 'Rank',
                                                asc: {
                                                    label: 'Sort rank lowest first',
                                                    value: 'rank',
                                                },
                                                desc: {
                                                    label: 'Sort rank highest first',
                                                    value: '-rank',
                                                },
                                            },
                                        ]}
                                    />
                                    <OrderingTh
                                        width="300px"
                                        whiteSpace="nowrap"
                                        options={[
                                            {
                                                label: 'Start date',
                                                asc: {
                                                    label: 'Sort start date oldest first',
                                                    value: '-start_date',
                                                },
                                                desc: {
                                                    label: 'Sort start date newest first',
                                                    value: 'start_date',
                                                },
                                            },
                                            {
                                                label: 'End date',
                                                asc: {
                                                    label: 'Sort end date oldest first',
                                                    value: '-end_date',
                                                },
                                                desc: {
                                                    label: 'Sort end date newest first',
                                                    value: 'end_date',
                                                },
                                            },
                                            {
                                                label: 'Duration',
                                                asc: {
                                                    label: 'Sort duration shortest first',
                                                    value: '-duration',
                                                },
                                                desc: {
                                                    label: 'Sort duration longest first',
                                                    value: 'duration',
                                                },
                                            },
                                        ]}
                                    />
                                    {!computePlan && (
                                        <OrderingTh
                                            width="200px"
                                            textAlign="right"
                                            options={[
                                                {
                                                    label: 'Compute plan',
                                                    asc: {
                                                        label: 'Sort compute plan Z -> A',
                                                        value: '-compute_plan_key',
                                                    },
                                                    desc: {
                                                        label: 'Sort compute plan A -> Z',
                                                        value: 'compute_plan_key',
                                                    },
                                                },
                                            ]}
                                        />
                                    )}
                                </Tr>
                            </Thead>
                            <Tbody data-cy={loading ? 'loading' : 'loaded'}>
                                {loading && (
                                    <TableSkeleton
                                        itemCount={count}
                                        currentPage={page}
                                        rowHeight="37px"
                                    >
                                        <Td>
                                            <Skeleton>
                                                <Status
                                                    size="sm"
                                                    status={TupleStatus.done}
                                                    withIcon={false}
                                                />
                                            </Skeleton>
                                        </Td>
                                        <Td>
                                            <Skeleton>
                                                <Text fontSize="sm">
                                                    Train on LoremIpsum
                                                </Text>
                                            </Skeleton>
                                            <Skeleton
                                                width="50px"
                                                height="16px"
                                                marginTop="0.5"
                                            />
                                        </Td>
                                        {!computePlan && (
                                            <Td>
                                                <Skeleton>
                                                    <Text
                                                        fontSize="sm"
                                                        noOfLines={1}
                                                        maxWidth="auto"
                                                    >
                                                        xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
                                                    </Text>
                                                </Skeleton>
                                            </Td>
                                        )}
                                        <Td textAlign="right">
                                            <Skeleton>
                                                <Text
                                                    fontSize="xs"
                                                    whiteSpace="nowrap"
                                                >
                                                    42
                                                </Text>
                                            </Skeleton>
                                        </Td>
                                    </TableSkeleton>
                                )}
                                {!loading && tasks.length === 0 && (
                                    <EmptyTr
                                        nbColumns={computePlan ? 3 : 4}
                                        asset="tuple"
                                    />
                                )}
                                {!loading &&
                                    tasks.map((task) => (
                                        <ClickableTr
                                            key={task.key}
                                            onClick={() =>
                                                setLocationPreserveParams(
                                                    compilePath(PATHS.TASK, {
                                                        key: task.key,
                                                    })
                                                )
                                            }
                                        >
                                            <Td>
                                                <Status
                                                    size="md"
                                                    status={task.status}
                                                    withIcon={false}
                                                    variant="solid"
                                                />
                                            </Td>
                                            <Td>
                                                <Text fontSize="sm">{`Task on ${task.worker}`}</Text>
                                                <Text fontSize="xs">
                                                    {`Rank ${task.rank}`}
                                                </Text>
                                            </Td>
                                            <Td fontSize="xs">
                                                <Timing asset={task} />
                                                <Duration asset={task} />
                                            </Td>
                                            {!computePlan && (
                                                <Td
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                >
                                                    <Text
                                                        noOfLines={1}
                                                        maxWidth="auto"
                                                        textAlign="right"
                                                    >
                                                        <Link
                                                            href={compilePath(
                                                                PATHS.COMPUTE_PLAN_TASKS,
                                                                {
                                                                    key: task.compute_plan_key,
                                                                }
                                                            )}
                                                        >
                                                            <ChakraLink
                                                                color="primary.500"
                                                                fontSize="xs"
                                                            >
                                                                {
                                                                    task.compute_plan_key
                                                                }
                                                            </ChakraLink>
                                                        </Link>
                                                    </Text>
                                                </Td>
                                            )}
                                        </ClickableTr>
                                    ))}
                            </Tbody>
                        </AssetsTable>
                    </Box>
                    <TablePagination currentPage={page} itemCount={count} />
                </VStack>
            </Box>
        </TableFiltersContext.Provider>
    );
};
export default TasksTable;
