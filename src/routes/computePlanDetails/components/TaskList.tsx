/** @jsxRuntime classic */

/** @jsx jsx */
import { useEffect, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
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
import { AnyTupleT, TupleStatus } from '@/modules/tasks/TuplesTypes';

import { isTesttupleT } from '@/libs/tuples';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useLocationWithParams from '@/hooks/useLocationWithParams';

import { compilePath, PATHS } from '@/routes';

import {
    CreationDateSkeletonTd,
    CreationDateTd,
    creationDateWidth,
} from '@/components/CreationDateTableCells';
import Skeleton from '@/components/Skeleton';
import Status from '@/components/Status';
import {
    EmptyTr,
    ownerColWidth,
    Table,
    TableSkeleton,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@/components/Table';
import TablePagination from '@/components/TablePagination';

import { Colors, Spaces } from '@/assets/theme';

const thStyle = css`
    & > div {
        background: ${Colors.darkBackground};
        padding: ${Spaces.medium} ${Spaces.medium};
    }

    &:first-of-type > div {
        border-top-left-radius: 8px;
        border-bottom-left-radius: 0;
    }
    &:last-of-type > div {
        border-top-right-radius: 8px;
        border-bottom-right-radius: 0;
    }
`;

const statusColWidth = css`
    width: 200px;
`;

const rankColWidth = css`
    width: 70px;
`;
const perfColWidth = css`
    width: 110px;
`;

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
        params: { page },
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
            list: retrieveComputePlanTrainTasks({ computePlanKey, page }),
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
            list: retrieveComputePlanTestTasks({ computePlanKey, page }),
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
            list: retrieveComputePlanCompositeTasks({ computePlanKey, page }),
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
            list: retrieveComputePlanAggregateTasks({ computePlanKey, page }),
            tasks: useAppSelector(
                (state) => state.computePlans.computePlanAggregateTasks
            ),
            count: useAppSelector(
                (state) => state.computePlans.computePlanAggregateTasksCount
            ),
        },
    ];

    useEffect(() => {
        if (computePlanKey) {
            dispatch(taskTypes[selectedTaskType].list);
        }
    }, [computePlanKey, selectedTaskType, page]);

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
        <div>
            {renderTasksButtons()}
            <Table>
                <Thead>
                    <Tr>
                        <Th css={[thStyle, creationDateWidth]}>
                            Creation date
                        </Th>
                        <Th css={[thStyle, statusColWidth]}>Current status</Th>
                        <Th css={[thStyle, ownerColWidth]}>Worker</Th>
                        <Th css={[thStyle, rankColWidth]}>Rank</Th>
                        <Th css={[thStyle, perfColWidth]}>Performance</Th>
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
                            <Td>
                                <Skeleton width={90} height={12} />
                            </Td>
                        </TableSkeleton>
                    )}
                    {!taskTypes[selectedTaskType].loading &&
                        taskTypes[selectedTaskType].tasks.length === 0 && (
                            <EmptyTr nbColumns={7} />
                        )}
                    {!taskTypes[selectedTaskType].loading &&
                        taskTypes[selectedTaskType].tasks.map((task) => (
                            <Tr
                                key={task.key}
                                highlighted={task.key === key}
                                onClick={() =>
                                    setLocationWithParams(
                                        compilePath(PATHS.COMPUTE_PLAN_TASK, {
                                            key: task.compute_plan_key,
                                            taskKey: task.key,
                                        })
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
                                    {task.compute_plan_key ? task.rank : '-'}
                                </Td>
                                <Td>
                                    {isTesttupleT(task) &&
                                    task.status === TupleStatus.done
                                        ? task.test.perf
                                        : 'N/A'}
                                </Td>
                            </Tr>
                        ))}
                    <TablePagination
                        colSpan={5}
                        currentPage={page}
                        itemCount={taskTypes[selectedTaskType].count}
                        asset={taskTypes[selectedTaskType].slug}
                    />
                </Tbody>
            </Table>
        </div>
    );
};

export default Tasks;
