import {
    VStack,
    Thead,
    Tr,
    Th,
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
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { RiAlertLine } from 'react-icons/ri';
import { Link } from 'wouter';

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

import { shortFormatDate } from '@/libs/utils';

import { useAppDispatch, useSearchFiltersEffect } from '@/hooks';
import useLocationWithParams from '@/hooks/useLocationWithParams';
import {
    TableFiltersContext,
    useTableFiltersContext,
} from '@/hooks/useTableFilters';

import { compilePath, PATHS } from '@/routes';

import {
    AssetsTable,
    AssetsTableRankDurationTh,
    AssetsTableStatusTh,
    ClickableTh,
} from '@/components/AssetsTable';
import Duration from '@/components/Duration';
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

    const dispatch = useAppDispatch();
    useSearchFiltersEffect(() => {
        const action = list();
        if (action) {
            dispatch(action);
        }
        // The computePlan is needed to trigger a list call once it has been fetched
    }, [searchFilters, category, page, computePlan]);

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
                                    <AssetsTableStatusTh
                                        onClick={() => onPopoverOpen(0)}
                                    />
                                    <ClickableTh
                                        onClick={() => onPopoverOpen(1)}
                                    >
                                        Category / Worker
                                    </ClickableTh>
                                    {!computePlan && (
                                        <ClickableTh
                                            onClick={() => onPopoverOpen(0)}
                                        >
                                            Compute plan
                                        </ClickableTh>
                                    )}
                                    <AssetsTableRankDurationTh
                                        onClick={() => onPopoverOpen(0)}
                                    />
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
                                        </Td>
                                        {!computePlan && (
                                            <Th>
                                                <Skeleton>
                                                    <Text fontSize="sm">
                                                        xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
                                                    </Text>
                                                </Skeleton>
                                            </Th>
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
                                                <Text
                                                    as="span"
                                                    fontSize="xs"
                                                    color={
                                                        !task.start_date
                                                            ? 'gray.500'
                                                            : ''
                                                    }
                                                >
                                                    {!task.start_date &&
                                                        'Not started yet'}
                                                    {task.start_date &&
                                                        `${shortFormatDate(
                                                            task.start_date
                                                        )} -> `}
                                                </Text>
                                                <Text
                                                    as="span"
                                                    fontSize="xs"
                                                    color={
                                                        !task.start_date ||
                                                        !task.end_date
                                                            ? 'gray.500'
                                                            : ''
                                                    }
                                                >
                                                    {task.start_date &&
                                                        !task.end_date &&
                                                        'Not ended yet'}
                                                    {task.start_date &&
                                                        task.end_date &&
                                                        shortFormatDate(
                                                            task.end_date
                                                        )}
                                                </Text>
                                            </Td>
                                            {!computePlan && (
                                                <Td
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
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
                                                            fontSize="sm"
                                                        >
                                                            {
                                                                task.compute_plan_key
                                                            }
                                                        </ChakraLink>
                                                    </Link>
                                                </Td>
                                            )}
                                            <Td textAlign="right" fontSize="xs">
                                                <Text>{`${task.rank}`}</Text>
                                                <Duration asset={task} />
                                            </Td>
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
