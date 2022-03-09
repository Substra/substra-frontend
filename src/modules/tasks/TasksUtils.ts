import {
    isCompositeTraintuple,
    isCompositeTraintupleStub,
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
} from './TuplesTypes';

export const CATEGORY_LABEL: Record<TaskCategory, string> = {
    TASK_TEST: 'Test',
    TASK_AGGREGATE: 'Aggregate',
    TASK_COMPOSITE: 'Composite train',
    TASK_TRAIN: 'Train',
};

export function getTaskCategory(task: AnyTupleT): string {
    return CATEGORY_LABEL[task.category];
}

export function getTaskDataset(
    task: Testtuple | Traintuple | CompositeTraintuple
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
    throw 'Invalid task types';
}

export function getPerf(
    task: TesttupleStub | Testtuple,
    metricKey: string
): number | null {
    if (!task.test.perfs) {
        return null;
    }

    const perf = task.test.perfs[metricKey];

    if (perf === undefined) {
        return null;
    }

    return perf;
}
