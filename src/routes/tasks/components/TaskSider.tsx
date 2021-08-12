import { Fragment, useEffect } from 'react';

import AggregateTaskSiderContent from './AggregateTaskSiderContent';
import CompositeTrainTaskSiderContent from './CompositeTrainTaskSiderContent';
import ComputePlanSiderSection from './ComputePlanSiderSection';
import LoadingSiderSection from './LoadingSiderSection';
import TestTaskSiderContent from './TestTaskSiderContent';
import TrainTaskSiderContent from './TrainTaskSiderContent';

import { retrieveTask } from '@/modules/tasks/TasksSlice';
import { TupleType } from '@/modules/tasks/TuplesTypes';

import {
    getTupleType,
    isAggregatetupleT,
    isCompositeTraintupleT,
    isTesttupleT,
    isTraintupleT,
} from '@/libs/tuples';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useLocationWithParams from '@/hooks/useLocationWithParams';

import { PATHS } from '@/routes';

import KeySiderSection from '@/components/KeySiderSection';
import Sider from '@/components/Sider';
import Skeleton from '@/components/Skeleton';

const titleTypes: { [key in TupleType]: string } = {
    traintuple: 'Train task',
    composite_traintuple: 'Composite train task',
    aggregatetuple: 'Aggregate task',
    testtuple: 'Test task',
};

const TaskSider = (): JSX.Element => {
    const { setLocationWithParams } = useLocationWithParams();
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

    useDocumentTitleEffect(
        (setDocumentTitle) => {
            if (key) {
                setDocumentTitle(`${key} (task)`);
            }
        },
        [key]
    );

    return (
        <Sider
            visible={visible}
            onCloseButtonClick={() => setLocationWithParams(PATHS.TASKS)}
            titleType="Task details"
            title={
                taskLoading || !task ? (
                    <Skeleton width={370} height={30} />
                ) : (
                    titleTypes[getTupleType(task)]
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
                    {isTraintupleT(task) && (
                        <TrainTaskSiderContent task={task} />
                    )}
                    {isCompositeTraintupleT(task) && (
                        <CompositeTrainTaskSiderContent task={task} />
                    )}
                    {isAggregatetupleT(task) && (
                        <AggregateTaskSiderContent task={task} />
                    )}
                    {isTesttupleT(task) && <TestTaskSiderContent task={task} />}
                </Fragment>
            )}
        </Sider>
    );
};

export default TaskSider;
