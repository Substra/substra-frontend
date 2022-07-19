import {
    isAggregatetuple,
    isCompositeTraintupleStub,
    isTraintupleStub,
} from '@/libs/tuples';

import { ModelT, ModelCategory } from './ModelsTypes';
import {
    AggregatetupleT,
    CompositeTraintupleStubT,
    TraintupleStubT,
} from './TuplesTypes';

type TupleWithModelsT =
    | TraintupleStubT
    | CompositeTraintupleStubT
    | AggregatetupleT;

function getModels(task: TupleWithModelsT): ModelT[] {
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

export function getSimpleModel(task: TupleWithModelsT): ModelT | undefined {
    const models = getModels(task);
    return models.find((model) => model.category === ModelCategory.simple);
}

export function getHeadModel(task: TupleWithModelsT): ModelT | undefined {
    const models = getModels(task);
    return models.find((model) => model.category === ModelCategory.head);
}
