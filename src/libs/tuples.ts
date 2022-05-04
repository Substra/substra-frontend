import {
    Aggregatetuple,
    AggregatetupleStub,
    AnyTupleT,
    CompositeTraintuple,
    CompositeTraintupleStub,
    TaskCategory,
    Testtuple,
    TesttupleStub,
    Traintuple,
    TraintupleStub,
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

export const isTraintupleStub = (task: unknown): task is TraintupleStub => {
    if (!isTuple(task)) {
        return false;
    }

    return task.category === TaskCategory.train;
};

export const isTraintuple = (task: unknown): task is Traintuple => {
    if (!isTraintupleStub(task)) {
        return false;
    }

    return (task as Traintuple).train.data_manager !== undefined;
};

export const isTesttupleStub = (task: unknown): task is TesttupleStub => {
    if (!isTuple(task)) {
        return false;
    }

    return task.category === TaskCategory.test;
};

export const isTesttuple = (task: unknown): task is Testtuple => {
    if (!isTesttupleStub(task)) {
        return false;
    }
    return (
        (task as Testtuple).test.data_manager !== undefined &&
        (task as Testtuple).test.metrics !== undefined
    );
};

export const isCompositeTraintupleStub = (
    task: unknown
): task is CompositeTraintupleStub => {
    if (!isTuple(task)) {
        return false;
    }

    return task.category === TaskCategory.composite;
};

export const isCompositeTraintuple = (
    task: unknown
): task is CompositeTraintuple => {
    if (!isCompositeTraintupleStub(task)) {
        return false;
    }

    return (task as CompositeTraintuple).composite.data_manager !== undefined;
};

const isAggregatetupleStub = (task: unknown): task is AggregatetupleStub => {
    if (!isTuple(task)) {
        return false;
    }

    return task.category === TaskCategory.aggregate;
};

export const isAggregatetuple = (task: unknown): task is Aggregatetuple => {
    if (!isAggregatetupleStub(task)) {
        return false;
    }
    return (task as Aggregatetuple).parent_tasks !== undefined;
};
