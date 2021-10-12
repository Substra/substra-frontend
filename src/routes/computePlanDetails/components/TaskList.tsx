import { useState } from 'react';

import { VStack, Table, Thead, Tr, Th, Tbody, Td, Box } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { AsyncThunkAction } from '@reduxjs/toolkit';

import { AssetType, PaginatedApiResponse } from '@/modules/common/CommonTypes';
import {
    retrieveComputePlanAggregateTasks,
    retrieveComputePlanCompositeTasks,
    retrieveComputePlanTasksArgs,
    retrieveComputePlanTestTasks,
    retrieveComputePlanTrainTasks,
} from '@/modules/computePlans/ComputePlansSlice';
import { AnyTupleT } from '@/modules/tasks/TuplesTypes';

import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersEffect,
} from '@/hooks';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useLocationWithParams from '@/hooks/useLocationWithParams';

import { compilePath, PATHS } from '@/routes';

import {
    CreationDateSkeletonTd,
    CreationDateTd,
} from '@/components/CreationDateTableCells';
import { WorkerTableFilter } from '@/components/NodeTableFilters';
import Skeleton from '@/components/Skeleton';
import Status from '@/components/Status';
import StatusTableFilter from '@/components/StatusTableFilter';
import { ClickableTr, EmptyTr, TableSkeleton } from '@/components/Table';
import TablePagination from '@/components/TablePagination';

import { Colors, Spaces } from '@/assets/theme';

interface TypeButtonProps {
    active: boolean;
}

const TypeButton = styled.button<TypeButtonProps>`
    background: ${({ active }) => (active ? Colors.primary : 'white')};
    border-color: ${({ active }) => (active ? Colors.primary : Colors.border)};
    border-radius: 4px;
    border-width: 1px;
    border-style: solid;
    color: ${({ active }) => (active ? 'white' : Colors.lightContent)};
    height: 38px;
    margin-right: ${Spaces.medium};
    padding: ${Spaces.small} ${Spaces.medium};
    text-transform: uppercase;
`;

const TaskButtonsContainer = styled.div`
    display: flex;
    margin: ${Spaces.medium} 0;
`;

interface selectedTaskT {
    id: number;
    name: string;
    searchLabel: string;
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
            name: 'Train tasks',
            searchLabel: 'Train task',
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
            name: 'Test tasks',
            searchLabel: 'Test task',
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
            name: 'Composite train tasks',
            searchLabel: 'Composite task',
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
            name: 'Aggregate tasks',
            searchLabel: 'Aggregate task',
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
            <TaskButtonsContainer>
                {taskTypes.map((taskType) => (
                    <TypeButton
                        onClick={() => {
                            setLocationWithParams({ page: 1 });
                            setSelectedTaskType(taskType.id);
                        }}
                        key={taskType.id}
                        active={selectedTaskType === taskType.id}
                    >
                        {taskType.name}
                    </TypeButton>
                ))}
            </TaskButtonsContainer>
        );
    };

    return (
        <VStack
            display="inline-block"
            spacing="2.5"
            padding="6"
            marginLeft="auto"
            marginRight="auto"
        >
            {renderTasksButtons()}
            <Box
                backgroundColor="white"
                borderRadius="lg"
                borderWidth="1px"
                borderStyle="solid"
                borderColor="gray.100"
            >
                <Table size="sm">
                    <Thead>
                        <Tr>
                            <Th>Creation date</Th>
                            <Th>
                                Current status
                                <StatusTableFilter
                                    asset={taskTypes[selectedTaskType].slug}
                                />
                            </Th>
                            <Th>
                                Worker
                                <WorkerTableFilter
                                    assets={[taskTypes[selectedTaskType].slug]}
                                />
                            </Th>
                            <Th>Rank</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {taskTypes[selectedTaskType].loading && (
                            <TableSkeleton
                                itemCount={taskTypes[selectedTaskType].count}
                                currentPage={page}
                            >
                                <CreationDateSkeletonTd />
                                <Td>
                                    <Skeleton width={150} height={12} />
                                </Td>
                                <Td>
                                    <Skeleton width={80} height={12} />
                                </Td>
                                <Td>
                                    <Skeleton width={60} height={12} />
                                </Td>
                            </TableSkeleton>
                        )}
                        {!taskTypes[selectedTaskType].loading &&
                            taskTypes[selectedTaskType].tasks.length === 0 && (
                                <EmptyTr nbColumns={4} />
                            )}
                        {!taskTypes[selectedTaskType].loading &&
                            taskTypes[selectedTaskType].tasks.map((task) => (
                                <ClickableTr
                                    key={task.key}
                                    onClick={() =>
                                        setLocationWithParams(
                                            compilePath(
                                                PATHS.COMPUTE_PLAN_TASK,
                                                {
                                                    key: task.compute_plan_key,
                                                    taskKey: task.key,
                                                }
                                            )
                                        )
                                    }
                                >
                                    <CreationDateTd
                                        creationDate={task.creation_date}
                                    />
                                    <Td>
                                        <Status status={task.status} />
                                    </Td>
                                    <Td>{task.worker}</Td>
                                    <Td>
                                        {task.compute_plan_key
                                            ? task.rank
                                            : '-'}
                                    </Td>
                                </ClickableTr>
                            ))}
                    </Tbody>
                </Table>
            </Box>
            <TablePagination
                currentPage={page}
                itemCount={taskTypes[selectedTaskType].count}
            />
        </VStack>
    );
};

export default Tasks;
