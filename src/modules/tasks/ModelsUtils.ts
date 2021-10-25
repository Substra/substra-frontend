import { Model, ModelCategory } from './ModelsTypes';
import {
    Aggregatetuple,
    CompositeTraintupleStub,
    TraintupleStub,
} from './TuplesTypes';

import {
    isAggregatetuple,
    isCompositeTraintupleStub,
    isTraintupleStub,
} from '@/libs/tuples';

type TupleWithModels =
    | TraintupleStub
    | CompositeTraintupleStub
    | Aggregatetuple;

export function getModels(task: TupleWithModels): Model[] {
    let models;
    if (isAggregatetuple(task)) {
        models = task.aggregate.models;
    } else if (isCompositeTraintupleStub(task)) {
        models = task.composite.models;
    } else if (isTraintupleStub(task)) {
        models = task.train.models;
    }
    return models || [];
}

export function getSimpleModel(task: TupleWithModels): Model | undefined {
    const models = getModels(task);
    return models.find((model) => model.category === ModelCategory.simple);
}

export function getHeadModel(task: TupleWithModels): Model | undefined {
    const models = getModels(task);
    return models.find((model) => model.category === ModelCategory.head);
}
