import {
    isCompositeTraintuple,
    isCompositeTraintupleStub,
    isPredicttuple,
    isPredicttupleStub,
    isTesttuple,
    isTesttupleStub,
    isTraintuple,
    isTraintupleStub,
} from '@/libs/tuples';
import { DatasetStubType } from '@/modules/datasets/DatasetsTypes';

import {
    AnyTupleT,
    TaskCategory,
    CompositeTraintupleStub,
    TesttupleStub,
    TraintupleStub,
    Testtuple,
    Traintuple,
    CompositeTraintuple,
    PredicttupleStub,
    Predicttuple,
} from './TuplesTypes';

export const CATEGORY_LABEL: Record<TaskCategory, string> = {
    TASK_TEST: 'Test',
    TASK_AGGREGATE: 'Aggregate',
    TASK_COMPOSITE: 'Composite train',
    TASK_TRAIN: 'Train',
    TASK_PREDICT: 'Predict',
};

export function getTaskCategory(task: AnyTupleT): string {
    return CATEGORY_LABEL[task.category];
}

export function getTaskDataset(
    task: Testtuple | Traintuple | CompositeTraintuple | Predicttuple
): DatasetStubType {
    if (isTesttuple(task)) {
        return task.test.data_manager;
    }
    if (isTraintuple(task)) {
        return task.train.data_manager;
    }
    if (isCompositeTraintuple(task)) {
        return task.composite.data_manager;
    }
    if (isPredicttuple(task)) {
        return task.predict.data_manager;
    }
    throw 'Invalid task type';
}

export function getTaskDataSampleKeys(
    task:
        | Testtuple
        | TesttupleStub
        | Traintuple
        | TraintupleStub
        | CompositeTraintuple
        | CompositeTraintupleStub
        | Predicttuple
        | PredicttupleStub
): string[] {
    if (isTesttuple(task) || isTesttupleStub(task)) {
        return task.test.data_sample_keys;
    }
    if (isTraintuple(task) || isTraintupleStub(task)) {
        return task.train.data_sample_keys;
    }
    if (isCompositeTraintuple(task) || isCompositeTraintupleStub(task)) {
        return task.composite.data_sample_keys;
    }
    if (isPredicttuple(task) || isPredicttupleStub(task)) {
        return task.predict.data_sample_keys;
    }
    throw 'Invalid task types';
}

export function getPerf(task: TesttupleStub | Testtuple): number | null {
    if (!task.test.perfs) {
        return null;
    }

    const perf = task.test.perfs[task.algo.key];

    if (perf === undefined) {
        return null;
    }

    return perf;
}
