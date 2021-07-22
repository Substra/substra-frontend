import { AnyTaskT } from './TasksTypes';
import { TupleStatus } from './TuplesTypes';

export const getTaskWorker = (task: AnyTaskT): string => {
    if (task.type === 'aggregatetuple') {
        return task.worker;
    }
    return task.dataset.worker;
};

export const getTaskPerf = (task: AnyTaskT): number | string => {
    if (task.type === 'testtuple' && task.status === TupleStatus.done) {
        return task.dataset.perf;
    }
    return 'N/A';
};
