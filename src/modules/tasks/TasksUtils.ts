import { AnyTupleT, TaskCategory } from './TuplesTypes';

const CATEGORY_LABEL: Record<TaskCategory, string> = {
    TASK_TEST: 'Test',
    TASK_AGGREGATE: 'Aggregate',
    TASK_COMPOSITE: 'Composite',
    TASK_TRAIN: 'Train',
};

export function getTaskCategory(task: AnyTupleT): string {
    return CATEGORY_LABEL[task.category];
}
