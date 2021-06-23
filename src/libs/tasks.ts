import { AggregateTaskType, TaskT } from '@/modules/tasks/TasksTypes';

export const isAggregateTask = (task: TaskT): task is AggregateTaskType => {
    if (typeof task !== 'object') {
        return false;
    }
    return (
        (task as AggregateTaskType).in_models !== undefined &&
        (task as AggregateTaskType).permissions !== undefined &&
        (task as AggregateTaskType).tag !== undefined &&
        (task as AggregateTaskType).worker !== undefined
    );
};
