import { ComputePlanT } from '@/types/ComputePlansTypes';
import { TaskStatus } from '@/types/TasksTypes';

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
    } else if (status === TaskStatus.waitingParentTasks) {
        return computePlan.waiting_parent_tasks_count;
    } else if (status === TaskStatus.waitingExecutorSlot) {
        return computePlan.waiting_executor_slot_count;
    }else if (status === TaskStatus.waitingBuilderSlot) {
        return computePlan.waiting_builder_slot_count;
    }else if (status === TaskStatus.building) {
        return computePlan.building_count;
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
