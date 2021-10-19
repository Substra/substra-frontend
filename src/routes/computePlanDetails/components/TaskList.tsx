import { useState } from 'react';

import {
    VStack,
    Table,
    Thead,
    Tr,
    Th,
    Tbody,
    Td,
    Box,
    Text,
    Tabs,
    TabList,
    Tab,
    Heading,
    Skeleton,
} from '@chakra-ui/react';
import { AsyncThunkAction } from '@reduxjs/toolkit';

import { AssetType, PaginatedApiResponse } from '@/modules/common/CommonTypes';
import {
    retrieveComputePlanAggregateTasks,
    retrieveComputePlanCompositeTasks,
    retrieveComputePlanTasksArgs,
    retrieveComputePlanTestTasks,
    retrieveComputePlanTrainTasks,
} from '@/modules/computePlans/ComputePlansSlice';
import { getTaskCategory } from '@/modules/tasks/TasksUtils';
import { AnyTupleT, TupleStatus } from '@/modules/tasks/TuplesTypes';

import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersEffect,
} from '@/hooks';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useLocationWithParams from '@/hooks/useLocationWithParams';

import { compilePath, PATHS } from '@/routes';

import SearchBar from '@/components/SearchBar';
import Status from '@/components/Status';
import { ClickableTr, EmptyTr, TableSkeleton } from '@/components/Table';
import TablePagination from '@/components/TablePagination';

interface selectedTaskT {
    id: number;
    name: string;
    slug: AssetType;
    loading: boolean;
    list: AsyncThunkAction<
        PaginatedApiResponse<AnyTupleT>,
        retrieveComputePlanTasksArgs,
        { rejectValue: string }
    >;
    tasks: AnyTupleT[];
    count: number;
}

const Tasks = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const {
        params: { page, search: searchFilters },
        setLocationWithParams,
    } = useLocationWithParams();

    // the || '' at the end is just a way to make sure computePlanKey is always a string.
    const computePlanKey =
        useAppSelector((state) => state.computePlans.computePlan?.key) || '';
    const [selectedTaskType, setSelectedTaskType] = useState(0);

    const taskTypes: selectedTaskT[] = [
        {
            id: 0,
            name: 'Train',
            slug: 'traintuple',
            loading: useAppSelector(
                (state) => state.computePlans.computePlanTrainTasksLoading
            ),
            list: retrieveComputePlanTrainTasks({
                computePlanKey,
                page,
                filters: searchFilters,
            }),
            tasks: useAppSelector(
                (state) => state.computePlans.computePlanTrainTasks
            ),
            count: useAppSelector(
                (state) => state.computePlans.computePlanTrainTasksCount
            ),
        },
        {
            id: 1,
            name: 'Test',
            slug: 'testtuple',
            loading: useAppSelector(
                (state) => state.computePlans.computePlanTestTasksLoading
            ),
            list: retrieveComputePlanTestTasks({
                computePlanKey,
                page,
                filters: searchFilters,
            }),
            tasks: useAppSelector(
                (state) => state.computePlans.computePlanTestTasks
            ),
            count: useAppSelector(
                (state) => state.computePlans.computePlanTestTasksCount
            ),
        },
        {
            id: 2,
            name: 'Composite',
            slug: 'composite_traintuple',
            loading: useAppSelector(
                (state) => state.computePlans.computePlanCompositeTasksLoading
            ),
            list: retrieveComputePlanCompositeTasks({
                computePlanKey,
                page,
                filters: searchFilters,
            }),
            tasks: useAppSelector(
                (state) => state.computePlans.computePlanCompositeTasks
            ),
            count: useAppSelector(
                (state) => state.computePlans.computePlanCompositeTasksCount
            ),
        },
        {
            id: 3,
            name: 'Aggregate',
            slug: 'aggregatetuple',
            loading: useAppSelector(
                (state) => state.computePlans.computePlanAggregateTasksLoading
            ),
            list: retrieveComputePlanAggregateTasks({
                computePlanKey,
                page,
                filters: searchFilters,
            }),
            tasks: useAppSelector(
                (state) => state.computePlans.computePlanAggregateTasks
            ),
            count: useAppSelector(
                (state) => state.computePlans.computePlanAggregateTasksCount
            ),
        },
    ];

    useSearchFiltersEffect(() => {
        if (computePlanKey) {
            dispatch(taskTypes[selectedTaskType].list);
        }
    }, [computePlanKey, searchFilters, selectedTaskType, page]);

    const key = useKeyFromPath(PATHS.COMPUTE_PLAN_TASK, 'taskKey');

    useAssetListDocumentTitleEffect('Tasks list', key);

    const renderTasksButtons = () => {
        return (
            <Tabs
                index={selectedTaskType}
                onChange={(newSelectedTaskType) => {
                    setLocationWithParams({ page: 1 });
                    setSelectedTaskType(newSelectedTaskType);
                }}
                variant="enclosed"
                size="sm"
            >
                <TabList marginBottom="0" borderBottomColor="gray.100">
                    {taskTypes.map((taskType) => (
                        <Tab
                            key={taskType.id}
                            _selected={{
                                color: 'teal.600',
                                bg: 'white',
                                borderColor: 'gray.100',
                                borderBottomColor: 'white',
                            }}
                        >
                            {taskType.name}
                        </Tab>
                    ))}
                </TabList>
            </Tabs>
        );
    };

    return (
        <VStack display="inline-block" spacing="2.5">
            <Heading size="xxs" textTransform="uppercase">
                Tasks
            </Heading>
            <SearchBar asset={taskTypes[selectedTaskType].slug} />
            <Box>
                {renderTasksButtons()}
                <VStack display="inline-block" spacing="2.5">
                    <Box
                        backgroundColor="white"
                        borderRadius="lg"
                        borderTopLeftRadius="0"
                        borderTopRightRadius="0"
                        borderWidth="1px"
                        borderStyle="solid"
                        borderColor="gray.100"
                        borderTop="none"
                    >
                        <Table size="md" minWidth="870px">
                            <Thead>
                                <Tr>
                                    <Th width="1px">Status</Th>
                                    <Th>Category / Worker</Th>
                                    <Th
                                        width="1px"
                                        textAlign="right"
                                        whiteSpace="nowrap"
                                    >
                                        Rank / Parent tasks
                                    </Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {taskTypes[selectedTaskType].loading && (
                                    <TableSkeleton
                                        itemCount={
                                            taskTypes[selectedTaskType].count
                                        }
                                        currentPage={page}
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
                                        <Td textAlign="right">
                                            <Skeleton>
                                                <Text
                                                    fontSize="xs"
                                                    whiteSpace="nowrap"
                                                >
                                                    42 • 2 parent tasks
                                                </Text>
                                            </Skeleton>
                                        </Td>
                                    </TableSkeleton>
                                )}
                                {!taskTypes[selectedTaskType].loading &&
                                    taskTypes[selectedTaskType].tasks.length ===
                                        0 && <EmptyTr nbColumns={3} />}
                                {!taskTypes[selectedTaskType].loading &&
                                    taskTypes[selectedTaskType].tasks.map(
                                        (task) => (
                                            <ClickableTr
                                                key={task.key}
                                                onClick={() =>
                                                    setLocationWithParams(
                                                        compilePath(
                                                            PATHS.COMPUTE_PLAN_TASK,
                                                            {
                                                                key:
                                                                    task.compute_plan_key,
                                                                taskKey:
                                                                    task.key,
                                                            }
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
                                                    )} on ${
                                                        task.worker
                                                    }`}</Text>
                                                </Td>
                                                <Td textAlign="right">
                                                    <Text
                                                        fontSize="xs"
                                                        whiteSpace="nowrap"
                                                    >
                                                        {`${task.rank} • `}
                                                        {task.parent_task_keys
                                                            .length === 0 &&
                                                            'no parent task'}
                                                        {task.parent_task_keys
                                                            .length === 1 &&
                                                            '1 parent task'}
                                                        {task.parent_task_keys
                                                            .length > 1 &&
                                                            `${task.parent_task_keys.length} parent tasks`}
                                                    </Text>
                                                </Td>
                                            </ClickableTr>
                                        )
                                    )}
                            </Tbody>
                        </Table>
                    </Box>
                    <TablePagination
                        currentPage={page}
                        itemCount={taskTypes[selectedTaskType].count}
                    />
                </VStack>
            </Box>
        </VStack>
    );
};

export default Tasks;
