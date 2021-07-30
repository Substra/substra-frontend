/** @jsxRuntime classic */

/** @jsx jsx */
import { Fragment, useState } from 'react';

import TaskSider from './components/TaskSider';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { AsyncThunkAction } from '@reduxjs/toolkit';

import { AssetType } from '@/modules/common/CommonTypes';
import {
    listAggregateTasks,
    listCompositeTasks,
    listTestTasks,
    listTrainTasks,
} from '@/modules/tasks/TasksSlice';
import { getTaskWorker } from '@/modules/tasks/TasksUtils';
import { AnyTupleT } from '@/modules/tasks/TuplesTypes';

import { SearchFilterType } from '@/libs/searchFilter';
import { isTesttupleT } from '@/libs/tuples';

import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersLocation,
    useSearchFiltersEffect,
} from '@/hooks';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';

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
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
} from '@/components/Table';
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
        AnyTupleT[],
        SearchFilterType[],
        { rejectValue: string }
    >;
    tasks: AnyTupleT[];
}

const Tasks = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [
        ,
        searchFilters,
        setSearchFiltersLocation,
    ] = useSearchFiltersLocation();

    const [selectedTaskType, setSelectedTaskType] = useState(0);

    const taskTypes: selectedTaskT[] = [
        {
            id: 0,
            name: 'Train tasks',
            searchLabel: 'Train task',
            slug: 'traintuple',
            loading: useAppSelector((state) => state.tasks.trainTasksLoading),
            list: listTrainTasks(searchFilters),
            tasks: useAppSelector((state) => state.tasks.trainTasks),
        },
        {
            id: 1,
            name: 'Test tasks',
            searchLabel: 'Test task',
            slug: 'testtuple',
            loading: useAppSelector((state) => state.tasks.testTasksLoading),
            list: listTestTasks(searchFilters),
            tasks: useAppSelector((state) => state.tasks.testTasks),
        },
        {
            id: 2,
            name: 'Composite tasks',
            searchLabel: 'Composite task',
            slug: 'composite_traintuple',
            loading: useAppSelector(
                (state) => state.tasks.compositeTasksLoading
            ),
            list: listCompositeTasks(searchFilters),
            tasks: useAppSelector((state) => state.tasks.compositeTasks),
        },
        {
            id: 3,
            name: 'Aggregate tasks',
            searchLabel: 'Aggregate task',
            slug: 'aggregatetuple',
            loading: useAppSelector(
                (state) => state.tasks.aggregateTasksLoading
            ),
            list: listAggregateTasks(searchFilters),
            tasks: useAppSelector((state) => state.tasks.aggregateTasks),
        },
    ];

    useSearchFiltersEffect(() => {
        dispatch(taskTypes[selectedTaskType].list);
    }, [searchFilters, selectedTaskType]);

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
                                        assets={[
                                            'traintuple',
                                            'testtuple',
                                            'composite_traintuple',
                                            'aggregatetuple',
                                        ]}
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
                    {taskTypes[selectedTaskType].loading &&
                        [1, 2, 3].map((index) => (
                            <Tr key={index}>
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
                            </Tr>
                        ))}
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
                                    setSearchFiltersLocation(
                                        compilePath(PATHS.TASK, {
                                            key: task.key,
                                        }),
                                        searchFilters
                                    )
                                }
                            >
                                <CreationDateTd
                                    creationDate={task.creation_date}
                                />
                                <Td>
                                    <Status status={task.status} />
                                </Td>
                                <Td>{getTaskWorker(task)}</Td>
                                <Td>Coming soon</Td>
                                <Td>{task.compute_plan_key || '-'}</Td>
                                <Td>
                                    {task.compute_plan_key ? task.rank : '-'}
                                </Td>
                                <Td>
                                    {isTesttupleT(task) &&
                                    task.status === 'done'
                                        ? task.dataset.perf
                                        : 'N/A'}
                                </Td>
                            </Tr>
                        ))}
                </Tbody>
            </Table>
        </PageLayout>
    );
};

export default Tasks;
