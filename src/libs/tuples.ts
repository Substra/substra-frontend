import {
    AggregatetupleT,
    AnyTupleT,
    CompositeTraintupleT,
    TaskCategory,
    TesttupleT,
    TraintupleT,
} from '@/modules/tasks/TuplesTypes';

const isTuple = (task: unknown): task is AnyTupleT => {
    if (typeof task !== 'object') {
        return false;
    }

    return (
        (task as AnyTupleT).key !== undefined &&
        (task as AnyTupleT).category !== undefined &&
        (task as AnyTupleT).creation_date !== undefined &&
        (task as AnyTupleT).algo !== undefined &&
        (task as AnyTupleT).compute_plan_key !== undefined &&
        (task as AnyTupleT).owner !== undefined &&
        (task as AnyTupleT).metadata !== undefined &&
        (task as AnyTupleT).status !== undefined &&
        (task as AnyTupleT).rank !== undefined &&
        (task as AnyTupleT).tag !== undefined &&
        (task as AnyTupleT).parent_task_keys !== undefined
    );
};

export const isTraintupleT = (task: unknown): task is TraintupleT => {
    if (!isTuple(task)) {
        return false;
    }

    return task.category === TaskCategory.train;
};

export const isTesttupleT = (task: unknown): task is TesttupleT => {
    if (!isTuple(task)) {
        return false;
    }

    return task.category === TaskCategory.test;
};

export const isCompositeTraintupleT = (
    task: unknown
): task is CompositeTraintupleT => {
    if (!isTuple(task)) {
        return false;
    }

    return task.category === TaskCategory.composite;
};

export const isAggregatetupleT = (task: unknown): task is AggregatetupleT => {
    if (!isTuple(task)) {
        return false;
    }

    return task.category === TaskCategory.aggregate;
};
