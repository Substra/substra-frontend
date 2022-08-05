import {
    AnyTupleT,
    CompositeTraintupleT,
    CompositeTraintupleStubT,
    PredicttupleT,
    PredicttupleStubT,
    TaskCategory,
    TesttupleT,
    TesttupleStubT,
    TraintupleT,
    TraintupleStubT,
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

export const isTraintupleStub = (task: unknown): task is TraintupleStubT => {
    if (!isTuple(task)) {
        return false;
    }

    return task.category === TaskCategory.train;
};

export const isTraintuple = (task: unknown): task is TraintupleT => {
    if (!isTraintupleStub(task)) {
        return false;
    }

    return (task as TraintupleT).train.data_manager !== undefined;
};

export const isTesttupleStub = (task: unknown): task is TesttupleStubT => {
    if (!isTuple(task)) {
        return false;
    }

    return task.category === TaskCategory.test;
};

export const isTesttuple = (task: unknown): task is TesttupleT => {
    if (!isTesttupleStub(task)) {
        return false;
    }
    return (task as TesttupleT).test.data_manager !== undefined;
};

export const isCompositeTraintupleStub = (
    task: unknown
): task is CompositeTraintupleStubT => {
    if (!isTuple(task)) {
        return false;
    }

    return task.category === TaskCategory.composite;
};

export const isCompositeTraintuple = (
    task: unknown
): task is CompositeTraintupleT => {
    if (!isCompositeTraintupleStub(task)) {
        return false;
    }

    return (task as CompositeTraintupleT).composite.data_manager !== undefined;
};

export const isPredicttupleStub = (
    task: unknown
): task is PredicttupleStubT => {
    if (!isTuple(task)) {
        return false;
    }

    return task.category === TaskCategory.predict;
};

export const isPredicttuple = (task: unknown): task is PredicttupleT => {
    if (!isPredicttupleStub(task)) {
        return false;
    }
    return (task as PredicttupleT).parent_tasks !== undefined;
};
