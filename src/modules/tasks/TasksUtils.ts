import { AnyTupleT, TaskCategory } from './TuplesTypes';

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
