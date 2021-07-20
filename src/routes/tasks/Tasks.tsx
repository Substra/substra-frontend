/** @jsxRuntime classic */

/** @jsx jsx */
import { Fragment } from 'react';

import TaskSider from './components/TaskSider';
import TypeTableFilter from './components/TypeTableFilter';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { listTasks } from '@/modules/tasks/TasksSlice';
import { AnyTaskT, TaskType } from '@/modules/tasks/TasksTypes';
import { getTaskWorker } from '@/modules/tasks/TasksUtils';

import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersLocation,
    useSearchFiltersEffect,
} from '@/hooks';

import { compilePath, PATHS, useKeyFromPath } from '@/routes';

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

const typeColWidth = css`
    width: 120px;
`;
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

const typeLabels: { [key in TaskType]: string } = {
    traintuple: 'Train',
    composite_traintuple: 'Composite train',
    aggregatetuple: 'Aggregate',
    testtuple: 'Test',
};

const Tasks = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [
        ,
        searchFilters,
        setSearchFiltersLocation,
    ] = useSearchFiltersLocation();

    useSearchFiltersEffect(() => {
        dispatch(listTasks(searchFilters));
    }, [searchFilters]);

    const tasks: AnyTaskT[] = useAppSelector((state) => state.tasks.tasks);

    const tasksLoading = useAppSelector((state) => state.tasks.tasksLoading);

    const key = useKeyFromPath(PATHS.TASK);

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
                            { label: 'Train task', value: 'traintuple' },
                            {
                                label: 'Composite train task',
                                value: 'composite_traintuple',
                            },
                            {
                                label: 'Aggregate task',
                                value: 'aggregatetuple',
                            },
                            {
                                label: 'Test task',
                                value: 'testtuple',
                            },
                        ]}
                    />
                    <Table>
                        <Thead>
                            <Tr>
                                <Th css={creationDateWidth}>Creation date</Th>
                                <Th css={typeColWidth}>
                                    Type
                                    <TypeTableFilter
                                        assets={[
                                            'traintuple',
                                            'testtuple',
                                            'composite_traintuple',
                                            'aggregatetuple',
                                        ]}
                                    />
                                </Th>
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
            <Table>
                <Thead
                    css={css`
                        opacity: 0;
                        pointer-events: none;
                    `}
                >
                    <Tr>
                        <Th css={creationDateWidth}>Creation date</Th>
                        <Th css={typeColWidth}>Type</Th>
                        <Th css={statusColWidth}>Current status</Th>
                        <Th css={ownerColWidth}>Worker</Th>
                        <Th css={timeColWidth}>Execution time</Th>
                        <Th css={computePlanColWidth}>Compute Plan</Th>
                        <Th css={rankColWidth}>Rank</Th>
                        <Th css={perfColWidth}>Performance</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {tasksLoading &&
                        [1, 2, 3].map((index) => (
                            <Tr key={index}>
                                <CreationDateSkeletonTd />
                                <Td>
                                    <Skeleton width={100} height={12} />
                                </Td>
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
                    {!tasksLoading && tasks.length === 0 && (
                        <EmptyTr nbColumns={8} />
                    )}
                    {!tasksLoading &&
                        tasks.map((task) => (
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
                                <Td>{typeLabels[task.type]}</Td>
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
                                    {task.type === 'testtuple' &&
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
