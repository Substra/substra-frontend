import { Model, ModelCategory } from './ModelsTypes';
import {
    AggregatetupleT,
    CompositeTraintupleT,
    TraintupleT,
} from './TuplesTypes';

import {
    isAggregatetupleT,
    isCompositeTraintupleT,
    isTraintupleT,
} from '@/libs/tuples';

type TupleWithModels = TraintupleT | CompositeTraintupleT | AggregatetupleT;

export function getModels(task: TupleWithModels): Model[] {
    let models;
    if (isAggregatetupleT(task)) {
        models = task.aggregate.models;
    } else if (isCompositeTraintupleT(task)) {
        models = task.composite.models;
    } else if (isTraintupleT(task)) {
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
