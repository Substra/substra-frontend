import {
    AggregatetupleT,
    AnyTupleT,
    CompositeTraintupleT,
    InModel,
    TesttupleT,
    TraintupleT,
    TupleType,
} from '@/modules/tasks/TuplesTypes';

export const isTraintupleT = (task: unknown): task is TraintupleT => {
    if (typeof task !== 'object') {
        return false;
    }

    return (
        (task as TraintupleT).dataset !== undefined &&
        (task as TraintupleT).in_models !== undefined &&
        (task as TraintupleT).out_model !== undefined &&
        (task as TraintupleT).permissions !== undefined &&
        (task as TraintupleT).rank !== undefined &&
        (task as TraintupleT).tag !== undefined
    );
};

export const isTesttupleT = (task: unknown): task is TesttupleT => {
    if (typeof task !== 'object') {
        return false;
    }

    return (
        (task as TesttupleT).certified !== undefined &&
        (task as TesttupleT).dataset !== undefined &&
        (task as TesttupleT).objective !== undefined &&
        (task as TesttupleT).rank !== undefined &&
        (task as TesttupleT).traintuple_key !== undefined &&
        (task as TesttupleT).traintuple_type !== undefined
    );
};

export const isCompositeTraintupleT = (
    task: unknown
): task is CompositeTraintupleT => {
    if (typeof task !== 'object') {
        return false;
    }

    return (
        (task as CompositeTraintupleT).dataset !== undefined &&
        (task as CompositeTraintupleT).out_head_model !== undefined &&
        (task as CompositeTraintupleT).out_trunk_model !== undefined &&
        (task as CompositeTraintupleT).tag !== undefined
    );
};

export const isAggregatetupleT = (task: unknown): task is AggregatetupleT => {
    if (typeof task !== 'object') {
        return false;
    }

    return (
        (task as AggregatetupleT).in_models !== undefined &&
        (task as AggregatetupleT).permissions !== undefined &&
        (task as AggregatetupleT).tag !== undefined &&
        (task as AggregatetupleT).worker !== undefined
    );
};

export const getTupleType = (tuple: AnyTupleT): TupleType => {
    if (isTraintupleT(tuple)) {
        return 'traintuple';
    } else if (isTesttupleT(tuple)) {
        return 'testtuple';
    } else if (isCompositeTraintupleT(tuple)) {
        return 'composite_traintuple';
    } else if (isAggregatetupleT(tuple)) {
        return 'aggregatetuple';
    }

    return new Error('Unknown tuple type') as never;
};

export const isInModel = (model: unknown): model is InModel => {
    if (typeof model !== 'object') {
        return false;
    }

    return (
        (model as InModel).key !== undefined &&
        (model as InModel).checksum !== undefined &&
        (model as InModel).storage_address !== undefined &&
        (model as InModel).traintuple_key !== undefined
    );
};
