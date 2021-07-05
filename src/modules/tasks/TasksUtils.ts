import { AnyTaskT } from './TasksTypes';

export const getTaskWorker = (task: AnyTaskT): string => {
    if (task.type === 'aggregatetuple') {
        return task.worker;
    }
    return task.dataset.worker;
};
