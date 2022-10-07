import { TaskStatus } from '@/modules/tasks/TasksTypes';

import { ComputePlanT } from './ComputePlansTypes';

export const getStatusCount = (
    computePlan: ComputePlanT,
    status: TaskStatus
): number => {
    if (status === TaskStatus.doing) {
        return computePlan.doing_count;
    } else if (status === TaskStatus.done) {
        return computePlan.done_count;
    } else if (status === TaskStatus.canceled) {
        return computePlan.canceled_count;
    } else if (status === TaskStatus.failed) {
        return computePlan.failed_count;
    } else if (status === TaskStatus.todo) {
        return computePlan.todo_count;
    } else if (status === TaskStatus.waiting) {
        return computePlan.waiting_count;
    }

    throw `Invalid status ${status}`;
};

export const compareComputePlans = (
    a: ComputePlanT,
    b: ComputePlanT
): -1 | 0 | 1 => {
    if (a.key < b.key) {
        return -1;
    } else if (a.key === b.key) {
        return 0;
    } else {
        return 1;
    }
};
