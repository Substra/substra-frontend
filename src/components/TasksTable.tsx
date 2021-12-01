import { useState } from 'react';

import SearchBar from './SearchBar';
import {
    StatusTableFilterTag,
    TableFilterTags,
    WorkerTableFilterTag,
} from './TableFilterTags';
import {
    VStack,
    Table,
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
} from '@chakra-ui/react';
import { AsyncThunkAction } from '@reduxjs/toolkit';

import { AssetType, PaginatedApiResponse } from '@/modules/common/CommonTypes';
import { retrieveComputePlanTasksArgs } from '@/modules/computePlans/ComputePlansSlice';
import { listTasksArgs } from '@/modules/tasks/TasksSlice';
import { getTaskCategory } from '@/modules/tasks/TasksUtils';
import { AnyTupleT, TupleStatus } from '@/modules/tasks/TuplesTypes';

import { formatDate } from '@/libs/utils';

import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersEffect,
} from '@/hooks';
import useLocationWithParams from '@/hooks/useLocationWithParams';

import Status from '@/components/Status';
import { ClickableTr, EmptyTr, TableSkeleton, Tbody } from '@/components/Table';
import {
    TableFilters,
    TaskStatusTableFilter,
    WorkerTableFilter,
} from '@/components/TableFilters';
import TablePagination from '@/components/TablePagination';

export interface selectedTaskT {
    id: number;
    name: string;
    slug: AssetType;
    loading: boolean;
    list: () => null | AsyncThunkAction<
        PaginatedApiResponse<AnyTupleT>,
        retrieveComputePlanTasksArgs | listTasksArgs,
        { rejectValue: string }
    >;
    tasks: AnyTupleT[];
    count: number;
}

interface TasksTableProps {
    taskTypes: selectedTaskT[];
    onTrClick: (taskKey: string) => () => void;
}

const TasksTable = ({ taskTypes, onTrClick }: TasksTableProps): JSX.Element => {
    const [selectedTaskType, setSelectedTaskType] = useState(0);
    const {
        params: { page, search: searchFilters },
        setLocationWithParams,
    } = useLocationWithParams();

    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );

    const dispatch = useAppDispatch();
    useSearchFiltersEffect(() => {
        const action = taskTypes[selectedTaskType].list();
        if (action) {
            dispatch(action);
        }
        // The computePlan is needed to trigger a list call once it has been fetched
    }, [searchFilters, selectedTaskType, page, computePlan]);

    return (
        <>
            <HStack spacing="2.5">
                <TableFilters asset={taskTypes[selectedTaskType].slug}>
                    <TaskStatusTableFilter />
                    <WorkerTableFilter />
                </TableFilters>
                <SearchBar asset={taskTypes[selectedTaskType].slug} />
            </HStack>
            <TableFilterTags asset={taskTypes[selectedTaskType].slug}>
                <StatusTableFilterTag />
                <WorkerTableFilterTag />
            </TableFilterTags>
            <Box>
                <Tabs
                    index={selectedTaskType}
                    onChange={(newSelectedTaskType) => {
                        setLocationWithParams({ page: 1 });
                        setSelectedTaskType(newSelectedTaskType);
                    }}
                    variant="enclosed"
                    size="sm"
                    position="relative"
                >
                    <TabList borderBottom="none">
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
                <VStack display="inline-block" spacing="2.5">
                    <Box
                        backgroundColor="white"
                        borderWidth="1px"
                        borderStyle="solid"
                        borderColor="gray.100"
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
                            <Tbody
                                data-cy={
                                    taskTypes[selectedTaskType].loading
                                        ? 'loading'
                                        : 'loaded'
                                }
                            >
                                {taskTypes[selectedTaskType].loading && (
                                    <TableSkeleton
                                        itemCount={
                                            taskTypes[selectedTaskType].count
                                        }
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
                                                onClick={onTrClick(task.key)}
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
                                                    <Text
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
                                                            `${formatDate(
                                                                task.start_date
                                                            )} ->`}
                                                    </Text>
                                                    <Text
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
                                                            formatDate(
                                                                task.end_date
                                                            )}
                                                    </Text>
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
        </>
    );
};
export default TasksTable;
