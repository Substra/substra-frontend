import { useState } from 'react';

import SearchBar from './SearchBar';
import {
    StatusTableFilterTag,
    TableFilterTags,
    WorkerTableFilterTag,
} from './TableFilterTags';
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
} from '@chakra-ui/react';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import { RiAlertLine, RiTimeLine } from 'react-icons/ri';

import { AssetType, PaginatedApiResponse } from '@/modules/common/CommonTypes';
import { retrieveComputePlanTasksArgs } from '@/modules/computePlans/ComputePlansSlice';
import { listTasksArgs } from '@/modules/tasks/TasksSlice';
import { getTaskCategory } from '@/modules/tasks/TasksUtils';
import {
    AnyTupleT,
    TupleStatus,
    assetTypeByTaskCategory,
} from '@/modules/tasks/TuplesTypes';

import { getDiffDates, shortFormatDate } from '@/libs/utils';

import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersEffect,
} from '@/hooks';
import useLocationWithParams from '@/hooks/useLocationWithParams';

import {
    AssetsTable,
    AssetsTableRankDurationTh,
    AssetsTableStatusTh,
} from '@/components/AssetsTable';
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

    const failedTasksCategory = computePlan?.failed_task?.category
        ? assetTypeByTaskCategory[computePlan?.failed_task?.category]
        : null;

    const dispatch = useAppDispatch();
    useSearchFiltersEffect(() => {
        const action = taskTypes[selectedTaskType].list();
        if (action) {
            dispatch(action);
        }
        // The computePlan is needed to trigger a list call once it has been fetched
    }, [searchFilters, selectedTaskType, page, computePlan]);

    const onTabsChange = (newSelectedTaskType: number) => {
        const currentType = taskTypes[selectedTaskType].slug;
        const newType = taskTypes[newSelectedTaskType].slug;
        setLocationWithParams({
            page: 1,
            search: searchFilters.map((searchFilter) => {
                if (searchFilter.asset === currentType) {
                    return { ...searchFilter, asset: newType };
                }
                return searchFilter;
            }),
        });
        setSelectedTaskType(newSelectedTaskType);
    };

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
                    onChange={onTabsChange}
                    variant="enclosed"
                    size="sm"
                    position="relative"
                >
                    <TabList borderBottom="none">
                        {taskTypes.map((taskType) => {
                            return failedTasksCategory !== taskType.slug ? (
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
                            ) : (
                                <Tab
                                    key={taskType.id}
                                    _selected={{
                                        bg: 'white',
                                        borderColor: 'gray.100',
                                        borderBottomColor: 'white',
                                    }}
                                    color="red.500"
                                    fontWeight="semibold"
                                >
                                    {taskType.name}
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
                                    <AssetsTableStatusTh />
                                    <Th>Category / Worker</Th>
                                    <AssetsTableRankDurationTh />
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
                                                    42
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
                                                <Td textAlign="right">
                                                    <Text
                                                        fontSize="xs"
                                                        whiteSpace="nowrap"
                                                    >
                                                        {`${task.rank}`}
                                                    </Text>
                                                    {task.start_date &&
                                                        task.end_date && (
                                                            <HStack justifyContent="flex-end">
                                                                <Icon
                                                                    as={
                                                                        RiTimeLine
                                                                    }
                                                                    fill="gray.500"
                                                                />
                                                                <Text
                                                                    fontSize="xs"
                                                                    color="gray.500"
                                                                    alignItems="center"
                                                                >
                                                                    {getDiffDates(
                                                                        task.start_date,
                                                                        task.end_date
                                                                    )}
                                                                </Text>
                                                            </HStack>
                                                        )}
                                                </Td>
                                            </ClickableTr>
                                        )
                                    )}
                            </Tbody>
                        </AssetsTable>
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
