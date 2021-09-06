/** @jsxRuntime classic */

/** @jsx jsx */
import { Fragment, useState } from 'react';

import TaskSider from './components/TaskSider';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { AsyncThunkAction } from '@reduxjs/toolkit';

import { AssetType, PaginatedApiResponse } from '@/modules/common/CommonTypes';
import {
    listAggregateTasks,
    listCompositeTasks,
    listTasksArgs,
    listTestTasks,
    listTrainTasks,
} from '@/modules/tasks/TasksSlice';
import { AnyTupleT, TupleStatus } from '@/modules/tasks/TuplesTypes';

import { isTesttupleT } from '@/libs/tuples';

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
    creationDateWidth,
} from '@/components/CreationDateTableCells';
import PageTitle from '@/components/PageTitle';
import SearchBar from '@/components/SearchBar';
import Skeleton from '@/components/Skeleton';
import Status from '@/components/Status';
import StatusTableFilter from '@/components/StatusTableFilter';
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
import PageLayout from '@/components/layout/PageLayout';
import Navigation from '@/components/layout/navigation/Navigation';

import { Colors, Spaces } from '@/assets/theme';

const statusColWidth = css`
    width: 200px;
`;
const timeColWidth = css`
    width: 120px;
`;
const computePlanColWidth = css`
    width: 270px;
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
        listTasksArgs,
        { rejectValue: string }
    >;
    tasks: AnyTupleT[];
    count: number;
}

const Tasks = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const {
        params: { search: searchFilters, page },
        setLocationWithParams,
    } = useLocationWithParams();

    const [selectedTaskType, setSelectedTaskType] = useState(0);

    const taskTypes: selectedTaskT[] = [
        {
            id: 0,
            name: 'Train tasks',
            searchLabel: 'Train task',
            slug: 'traintuple',
            loading: useAppSelector((state) => state.tasks.trainTasksLoading),
            list: listTrainTasks({ filters: searchFilters, page }),
            tasks: useAppSelector((state) => state.tasks.trainTasks),
            count: useAppSelector((state) => state.tasks.trainTasksCount),
        },
        {
            id: 1,
            name: 'Test tasks',
            searchLabel: 'Test task',
            slug: 'testtuple',
            loading: useAppSelector((state) => state.tasks.testTasksLoading),
            list: listTestTasks({ filters: searchFilters, page }),
            tasks: useAppSelector((state) => state.tasks.testTasks),
            count: useAppSelector((state) => state.tasks.testTasksCount),
        },
        {
            id: 2,
            name: 'Composite train tasks',
            searchLabel: 'Composite task',
            slug: 'composite_traintuple',
            loading: useAppSelector(
                (state) => state.tasks.compositeTasksLoading
            ),
            list: listCompositeTasks({ filters: searchFilters, page }),
            tasks: useAppSelector((state) => state.tasks.compositeTasks),
            count: useAppSelector((state) => state.tasks.compositeTasksCount),
        },
        {
            id: 3,
            name: 'Aggregate tasks',
            searchLabel: 'Aggregate task',
            slug: 'aggregatetuple',
            loading: useAppSelector(
                (state) => state.tasks.aggregateTasksLoading
            ),
            list: listAggregateTasks({ filters: searchFilters, page }),
            tasks: useAppSelector((state) => state.tasks.aggregateTasks),
            count: useAppSelector((state) => state.tasks.aggregateTasksCount),
        },
    ];

    useSearchFiltersEffect(() => {
        dispatch(taskTypes[selectedTaskType].list);
    }, [searchFilters, selectedTaskType, page]);

    const key = useKeyFromPath(PATHS.TASK);

    useAssetListDocumentTitleEffect('Tasks list', key);

    const renderTasksButtons = () => {
        return (
            <TaskButtonsContainer>
                {taskTypes.map((taskType) => (
                    <TypeButton
                        onClick={() => setSelectedTaskType(taskType.id)}
                        key={taskType.id}
                        active={selectedTaskType === taskType.id}
                    >
                        {taskType.name}
                    </TypeButton>
                ))}
            </TaskButtonsContainer>
        );
    };

    const pageTitleLinks = [
        {
            location: PATHS.COMPUTE_PLANS,
            title: 'Compute Plans',
            active: false,
        },
        {
            location: PATHS.TASKS,
            title: 'Tasks',
            active: true,
        },
    ];

    return (
        <PageLayout
            siderVisible={!!key}
            navigation={<Navigation />}
            sider={<TaskSider />}
            stickyHeader={
                <Fragment>
                    <PageTitle links={pageTitleLinks} />
                    <SearchBar
                        assetOptions={[
                            {
                                label: taskTypes[selectedTaskType].searchLabel,
                                value: taskTypes[selectedTaskType].slug,
                            },
                        ]}
                    />
                    {renderTasksButtons()}
                    <Table>
                        <Thead>
                            <Tr>
                                <Th css={creationDateWidth}>Creation date</Th>
                                <Th css={statusColWidth}>
                                    Current status
                                    <StatusTableFilter
                                        asset={taskTypes[selectedTaskType].slug}
                                    />
                                </Th>
                                <Th css={ownerColWidth}>Worker</Th>
                                <Th css={timeColWidth}>Execution time</Th>
                                <Th css={computePlanColWidth}>Compute Plan</Th>
                                <Th css={rankColWidth}>Rank</Th>
                                <Th css={perfColWidth}>Performance</Th>
                            </Tr>
                        </Thead>
                    </Table>
                </Fragment>
            }
        >
            <PageTitle
                links={pageTitleLinks}
                css={css`
                    opacity: 0;
                    pointer-events: none;
                `}
            />
            {renderTasksButtons()}
            <Table>
                <Thead
                    css={css`
                        opacity: 0;
                        pointer-events: none;
                    `}
                >
                    <Tr>
                        <Th css={creationDateWidth}>Creation date</Th>
                        <Th css={statusColWidth}>Current status</Th>
                        <Th css={ownerColWidth}>Worker</Th>
                        <Th css={timeColWidth}>Execution time</Th>
                        <Th css={computePlanColWidth}>Compute Plan</Th>
                        <Th css={rankColWidth}>Rank</Th>
                        <Th css={perfColWidth}>Performance</Th>
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
                                <Skeleton width={80} height={12} />
                            </Td>
                            <Td>
                                <Skeleton width={220} height={12} />
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
                                        compilePath(PATHS.TASK, {
                                            key: task.key,
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
                                <Td>Coming soon</Td>
                                <Td>{task.compute_plan_key || '-'}</Td>
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
                        colSpan={7}
                        currentPage={page}
                        itemCount={taskTypes[selectedTaskType].count}
                        asset={taskTypes[selectedTaskType].slug}
                    />
                </Tbody>
            </Table>
        </PageLayout>
    );
};

export default Tasks;
