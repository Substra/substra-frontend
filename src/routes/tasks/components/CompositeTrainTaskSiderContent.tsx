import { Fragment, useState, useEffect } from 'react';

import AlgoSiderSection from './AlgoSiderSection';
import DatasetSiderSection from './DatasetSiderSection';
import LoadingSiderSection from './LoadingSiderSection';
import ModelSiderSection from './ModelSiderSection';

import { Model } from '@/modules/tasks/ModelsTypes';
import { getHeadModel, getSimpleModel } from '@/modules/tasks/ModelsUtils';
import {
    retrieveAggregateTuple,
    retrieveCompositeTraintuple,
} from '@/modules/tasks/TasksApi';
import { CompositeTraintupleT } from '@/modules/tasks/TuplesTypes';

import PermissionSiderSection from '@/components/PermissionSiderSection';

interface CompositeTrainTaskSiderContentProps {
    task: CompositeTraintupleT;
}

const CompositeTrainTaskSiderContent = ({
    task,
}: CompositeTrainTaskSiderContentProps): JSX.Element => {
    // All of the following is only here to understand what the parent_task_keys are referring to.
    // The orchestrator only gives us a key, not the type of tuple it refers to.
    const [loading, setLoading] = useState(true);
    const [inHeadModel, setInHeadModel] = useState<Model | undefined>();
    const [inTrunkModel, setInTrunkModel] = useState<Model | undefined>();
    const [isInTrunkTupleAggregate, setIsInTrunkTupleAggregate] = useState(
        false
    );

    useEffect(() => {
        setLoading(true);

        if (task.parent_task_keys.length === 0) {
            // no parent task
            setLoading(false);
            setInHeadModel(undefined);
            setInTrunkModel(undefined);
            setIsInTrunkTupleAggregate(false);
        } else if (task.parent_task_keys.length === 1) {
            // 1 parent task: it must be a composite train task
            (async () => {
                const response = await retrieveCompositeTraintuple(
                    task.parent_task_keys[0]
                );
                setInHeadModel(getHeadModel(response.data));
                setInTrunkModel(getSimpleModel(response.data));
                setIsInTrunkTupleAggregate(false);
                setLoading(false);
            })();
        } else {
            // 2 parent tasks: one must be a composite train task and the other an aggregate
            (async () => {
                let compositeResponse, aggregateResponse;
                try {
                    compositeResponse = await retrieveCompositeTraintuple(
                        task.parent_task_keys[0]
                    );
                    aggregateResponse = await retrieveAggregateTuple(
                        task.parent_task_keys[1]
                    );
                } catch {
                    compositeResponse = await retrieveCompositeTraintuple(
                        task.parent_task_keys[1]
                    );
                    aggregateResponse = await retrieveAggregateTuple(
                        task.parent_task_keys[0]
                    );
                }
                setInHeadModel(getHeadModel(compositeResponse.data));
                setInTrunkModel(getSimpleModel(aggregateResponse.data));
                setIsInTrunkTupleAggregate(true);
                setLoading(false);
            })();
        }
    }, [task.parent_task_keys]);

    const trunkModel = getSimpleModel(task);
    const headModel = getHeadModel(task);

    return (
        <Fragment>
            <AlgoSiderSection task={task} />
            <DatasetSiderSection task={task} />
            {loading && (
                <Fragment>
                    <LoadingSiderSection />
                    <LoadingSiderSection />
                </Fragment>
            )}
            {!loading && (
                <Fragment>
                    <ModelSiderSection
                        title="In trunk model"
                        model={inTrunkModel}
                        sourceTupleTitle={
                            isInTrunkTupleAggregate
                                ? 'Aggregated trunk model from task'
                                : 'Out trunk model from task'
                        }
                    />
                    <ModelSiderSection
                        title="In head model"
                        model={inHeadModel}
                        sourceTupleTitle="Out head model from task"
                    />
                </Fragment>
            )}
            <PermissionSiderSection
                title="Out trunk model permissions"
                permissions={task.composite.trunk_permissions}
                modelKey={trunkModel?.key}
                modelUrl={trunkModel?.address?.storage_address}
                modelButtonTitle="Download out trunk model"
            />
            <PermissionSiderSection
                title="Out head model permissions"
                permissions={task.composite.head_permissions}
                modelKey={headModel?.key}
                modelUrl={headModel?.address?.storage_address}
                modelButtonTitle="Download out head model"
            />
        </Fragment>
    );
};

export default CompositeTrainTaskSiderContent;
