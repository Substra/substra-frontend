import { Fragment, useEffect } from 'react';

import AggregateTaskSiderContent from './AggregateTaskSiderContent';
import CompositeTrainTaskSiderContent from './CompositeTrainTaskSiderContent';
import ComputePlanSiderSection from './ComputePlanSiderSection';
import LoadingSiderSection from './LoadingSiderSection';
import TestTaskSiderContent from './TestTaskSiderContent';
import TrainTaskSiderContent from './TrainTaskSiderContent';

import { retrieveTask } from '@/modules/tasks/TasksSlice';
import { TaskType } from '@/modules/tasks/TasksTypes';

import {
    useAppDispatch,
    useAppSelector,
    useSearchFiltersLocation,
} from '@/hooks';

import { PATHS, useKeyFromPath } from '@/routes';

import KeySiderSection from '@/components/KeySiderSection';
import Sider from '@/components/Sider';
import Skeleton from '@/components/Skeleton';

const titleTypes: { [key in TaskType]: string } = {
    traintuple: 'Train task',
    composite_traintuple: 'Composite train task',
    aggregatetuple: 'Aggregate task',
    testtuple: 'Test task',
};

const TaskSider = (): JSX.Element => {
    const [
        ,
        searchFilters,
        setSearchFiltersLocation,
    ] = useSearchFiltersLocation();
    const key = useKeyFromPath(PATHS.TASK);

    const visible = !!key;

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (key) {
            dispatch(retrieveTask(key));
        }
    }, [key]);

    const task = useAppSelector((state) => state.tasks.task);
    const taskLoading = useAppSelector((state) => state.tasks.taskLoading);

    return (
        <Sider
            visible={visible}
            onCloseButtonClick={() =>
                setSearchFiltersLocation(PATHS.TASKS, searchFilters)
            }
            titleType="Task details"
            title={
                taskLoading || !task ? (
                    <Skeleton width={370} height={30} />
                ) : (
                    titleTypes[task.type]
                )
            }
        >
            <KeySiderSection assetKey={key || ''} />
            <ComputePlanSiderSection />
            {taskLoading && (
                <Fragment>
                    <LoadingSiderSection />
                    <LoadingSiderSection />
                    <LoadingSiderSection />
                </Fragment>
            )}
            {!taskLoading && task && (
                <Fragment>
                    {task.type === 'traintuple' && (
                        <TrainTaskSiderContent task={task} />
                    )}
                    {task.type === 'composite_traintuple' && (
                        <CompositeTrainTaskSiderContent task={task} />
                    )}
                    {task.type === 'aggregatetuple' && (
                        <AggregateTaskSiderContent task={task} />
                    )}
                    {task.type === 'testtuple' && (
                        <TestTaskSiderContent task={task} />
                    )}
                </Fragment>
            )}
        </Sider>
    );
};

export default TaskSider;
