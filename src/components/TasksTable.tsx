import { useEffect } from 'react';

import { AsyncThunkAction } from '@reduxjs/toolkit';
import { Link } from 'wouter';

import {
    VStack,
    Thead,
    Tr,
    Td,
    Box,
    Text,
    Tabs,
    TabList,
    Tab,
    Skeleton,
    HStack,
    Icon,
    Link as ChakraLink,
    TableProps,
} from '@chakra-ui/react';
import { RiAlertLine } from 'react-icons/ri';

import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import {
    useLocationWithParams,
    useSetLocationPreserveParams,
    getUrlSearchParams,
} from '@/hooks/useLocationWithParams';
import {
    useCreationDate,
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
import { PaginatedApiResponse } from '@/modules/common/CommonTypes';
import { retrieveComputePlanTasksArgs } from '@/modules/computePlans/ComputePlansSlice';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { listTasksArgs } from '@/modules/tasks/TasksSlice';
import { getTaskCategory } from '@/modules/tasks/TasksUtils';
import {
    AnyTupleT,
    TupleStatus,
    assetTypeByTaskCategory,
    TaskCategory,
} from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS } from '@/routes';

import { AssetsTable } from '@/components/AssetsTable';
import Duration from '@/components/Duration';
import OrderingTh from '@/components/OrderingTh';
import SearchBar from '@/components/SearchBar';
import Status from '@/components/Status';
import { ClickableTr, EmptyTr, TableSkeleton, Tbody } from '@/components/Table';
import {
    DateFilterTag,
    StatusTableFilterTag,
    TableFilterTags,
    WorkerTableFilterTag,
} from '@/components/TableFilterTags';
import {
    CreationDateTableFilter,
    EndDateTableFilter,
    StartDateTableFilter,
    TableFilters,
    TaskStatusTableFilter,
    WorkerTableFilter,
} from '@/components/TableFilters';
import TablePagination from '@/components/TablePagination';
import Timing from '@/components/Timing';

interface TasksTableProps {
    loading: boolean;
    list: () => null | AsyncThunkAction<
        PaginatedApiResponse<AnyTupleT>,
        retrieveComputePlanTasksArgs | listTasksArgs,
        { rejectValue: string }
    >;
    tasks: AnyTupleT[];
    count: number;
    category: TaskCategory;
    computePlan?: ComputePlanT | null;
    compileListPath: (category: TaskCategory) => string;
    compileDetailsPath: (category: TaskCategory, key: string) => string;
    tableProps?: TableProps;
}

const TasksTable = ({
    loading,
    list,
    tasks,
    count,
    category,
    computePlan,
    compileListPath,
    compileDetailsPath,
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
    const [, setLocationWithParams] = useLocationWithParams();
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
        category,
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
    ]);

    const tabs: [TaskCategory, string][] = [
        [TaskCategory.test, 'Test'],
        [TaskCategory.train, 'Train'],
        [TaskCategory.composite, 'Composite train'],
        [TaskCategory.aggregate, 'Aggregate'],
    ];

    const tabIndex = tabs.findIndex((tab) => tab[0] === category);

    const onTabsChange = (index: number) => {
        const newCategory = tabs[index][0];

        const urlSearchParams = getUrlSearchParams();
        urlSearchParams.set('page', '1');
        setLocationWithParams(compileListPath(newCategory), urlSearchParams);
    };

    const context = useTableFiltersContext(assetTypeByTaskCategory[category]);
    const { onPopoverOpen } = context;

    return (
        <TableFiltersContext.Provider value={context}>
            <HStack spacing="2.5">
                <TableFilters>
                    <TaskStatusTableFilter />
                    <WorkerTableFilter />
                    <CreationDateTableFilter />
                    <StartDateTableFilter />
                    <EndDateTableFilter />
                </TableFilters>
                <SearchBar placeholder="Search key..." />
            </HStack>
            <TableFilterTags>
                <StatusTableFilterTag />
                <WorkerTableFilterTag />
                <DateFilterTag
                    urlParam="creation_date_before"
                    label="Max creation date"
                />
                <DateFilterTag
                    urlParam="creation_date_after"
                    label="Min creation date"
                />
                <DateFilterTag
                    urlParam="start_date_before"
                    label="Max start date"
                />
                <DateFilterTag
                    urlParam="start_date_after"
                    label="Min start date"
                />
                <DateFilterTag
                    urlParam="end_date_before"
                    label="Max end date"
                />
                <DateFilterTag urlParam="end_date_after" label="Min end date" />
            </TableFilterTags>
            <Box>
                <Tabs
                    index={tabIndex}
                    onChange={onTabsChange}
                    variant="enclosed"
                    size="sm"
                    position="relative"
                >
                    <TabList borderBottom="none">
                        {tabs.map(([tabCategory, tabLabel]) => {
                            return computePlan?.failed_task?.category !==
                                tabCategory ? (
                                <Tab
                                    key={tabCategory}
                                    _selected={{
                                        color: 'teal.600',
                                        bg: 'white',
                                        borderColor: 'gray.100',
                                        borderBottomColor: 'white',
                                    }}
                                >
                                    {tabLabel}
                                </Tab>
                            ) : (
                                <Tab
                                    key={tabCategory}
                                    _selected={{
                                        bg: 'white',
                                        borderColor: 'gray.100',
                                        borderBottomColor: 'white',
                                    }}
                                    color="red.500"
                                    fontWeight="semibold"
                                >
                                    {tabLabel}
                                    <Icon
                                        as={RiAlertLine}
                                        fill="red.500"
                                        marginLeft={1}
                                    />
                                </Tab>
                            );
                        })}
                    </TabList>
                </Tabs>
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
                                                asc: {
                                                    label: 'Sort status WAITING -> DONE',
                                                    value: 'status',
                                                },
                                                desc: {
                                                    label: 'Sort status DONE -> WAITING',
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
                                        width="240px"
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
                                                        isTruncated
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
                                        asset={
                                            assetTypeByTaskCategory[category]
                                        }
                                    />
                                )}
                                {!loading &&
                                    tasks.map((task) => (
                                        <ClickableTr
                                            key={task.key}
                                            onClick={() =>
                                                setLocationPreserveParams(
                                                    compileDetailsPath(
                                                        category,
                                                        task.key
                                                    )
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
                                                <Text fontSize="sm">{`${getTaskCategory(
                                                    task
                                                )} on ${task.worker}`}</Text>
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
                                                        isTruncated
                                                        maxWidth="auto"
                                                        textAlign="right"
                                                    >
                                                        <Link
                                                            href={compilePath(
                                                                PATHS.COMPUTE_PLAN_TASKS_ROOT,
                                                                {
                                                                    key: task.compute_plan_key,
                                                                }
                                                            )}
                                                        >
                                                            <ChakraLink
                                                                color="teal.500"
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
