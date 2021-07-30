import { AnyTupleT, TupleStatus } from './TuplesTypes';

import { isAggregatetupleT, isTesttupleT } from '@/libs/tuples';

export const getTaskWorker = (task: AnyTupleT): string => {
    if (isAggregatetupleT(task)) {
        return task.worker;
    }
    return task.dataset.worker;
};

export const getTaskPerf = (task: AnyTupleT): number | string => {
    if (isTesttupleT(task) && task.status === TupleStatus.done) {
        return task.dataset.perf;
    }
    return 'N/A';
};
