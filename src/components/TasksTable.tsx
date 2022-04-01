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
} from '@chakra-ui/react';
import { RiAlertLine } from 'react-icons/ri';

import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import useLocationWithParams from '@/hooks/useLocationWithParams';
import useSearchFiltersEffect from '@/hooks/useSearchFiltersEffect';
import { useSyncedStringState } from '@/hooks/useSyncedState';
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
    StatusTableFilterTag,
    TableFilterTags,
    WorkerTableFilterTag,
} from '@/components/TableFilterTags';
import {
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
}: TasksTableProps): JSX.Element => {
    const {
        params: { page, search: searchFilters },
        setLocationWithParams,
    } = useLocationWithParams();
    const [ordering] = useSyncedStringState('ordering', '-rank');

    const dispatchWithAutoAbort = useDispatchWithAutoAbort();
    useSearchFiltersEffect(() => {
        const action = list();
        if (action) {
            return dispatchWithAutoAbort(action);
        }
        // The computePlan is needed to trigger a list call once it has been fetched
    }, [searchFilters, category, page, computePlan, ordering]);

    const tabs: [TaskCategory, string][] = [
        [TaskCategory.test, 'Test'],
        [TaskCategory.train, 'Train'],
        [TaskCategory.composite, 'Composite train'],
        [TaskCategory.aggregate, 'Aggregate'],
    ];

    const tabIndex = tabs.findIndex((tab) => tab[0] === category);

    const onTabsChange = (index: number) => {
        const newCategory = tabs[index][0];
        const currentType = assetTypeByTaskCategory[category];
        const newType = assetTypeByTaskCategory[newCategory];
        setLocationWithParams(compileListPath(newCategory), {
            page: 1,
            search: searchFilters.map((searchFilter) => {
                if (searchFilter.asset === currentType) {
                    return { ...searchFilter, asset: newType };
                }
                return searchFilter;
            }),
        });
    };

    const context = useTableFiltersContext(assetTypeByTaskCategory[category]);
    const { onPopoverOpen } = context;

    return (
        <TableFiltersContext.Provider value={context}>
            <HStack spacing="2.5">
                <TableFilters>
                    <TaskStatusTableFilter />
                    <WorkerTableFilter />
                </TableFilters>
                <SearchBar asset={assetTypeByTaskCategory[category]} />
            </HStack>
            <TableFilterTags>
                <StatusTableFilterTag />
                <WorkerTableFilterTag />
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
                        <AssetsTable>
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
                                        openFilters={() => onPopoverOpen(1)}
                                        options={[
                                            {
                                                label: 'Category',
                                                asc: {
                                                    label: 'Sort category A -> Z',
                                                    value: 'category',
                                                },
                                                desc: {
                                                    label: 'Sort category Z -> A',
                                                    value: '-category',
                                                },
                                            },
                                            {
                                                label: 'Worker',
                                                asc: {
                                                    label: 'Sort worker A -> Z',
                                                    value: 'worker',
                                                },
                                                desc: {
                                                    label: 'Sort worker Z -> A',
                                                    value: '-worker',
                                                },
                                            },
                                            {
                                                label: 'Rank',
                                                asc: {
                                                    label: 'Sort rank smallest first',
                                                    value: 'rank',
                                                },
                                                desc: {
                                                    label: 'Sort rank biggest first',
                                                    value: '-rank',
                                                },
                                            },
                                        ]}
                                    />
                                    <OrderingTh
                                        openFilters={() => onPopoverOpen(0)}
                                        width="240px"
                                        whiteSpace="nowrap"
                                        options={[
                                            {
                                                label: 'Start date',
                                                asc: {
                                                    label: 'Sort start date newest first',
                                                    value: 'start_date',
                                                },
                                                desc: {
                                                    label: 'Sort start date oldest first',
                                                    value: '-start_date',
                                                },
                                            },
                                            {
                                                label: 'End date',
                                                asc: {
                                                    label: 'Sort end date newest first',
                                                    value: 'end_date',
                                                },
                                                desc: {
                                                    label: 'Sort end date oldest first',
                                                    value: '-end_date',
                                                },
                                            },
                                        ]}
                                    />
                                    {!computePlan && (
                                        <OrderingTh
                                            openFilters={() => onPopoverOpen(1)}
                                            width="200px"
                                            textAlign="right"
                                            options={[
                                                {
                                                    label: 'Compute plan',
                                                    asc: {
                                                        label: 'Sort compute plan A -> Z',
                                                        value: 'compute_plan_key',
                                                    },
                                                    desc: {
                                                        label: 'Sort compute plan Z -> A',
                                                        value: '-compute_plan_key',
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
                                                setLocationWithParams(
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
