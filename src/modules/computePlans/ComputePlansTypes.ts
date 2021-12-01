import { TaskCategory } from '@/modules/tasks/TuplesTypes';

export enum ComputePlanStatus {
    waiting = 'PLAN_STATUS_WAITING',
    todo = 'PLAN_STATUS_TODO',
    doing = 'PLAN_STATUS_DOING',
    done = 'PLAN_STATUS_DONE',
    canceled = 'PLAN_STATUS_CANCELED',
    failed = 'PLAN_STATUS_FAILED',
}

export enum ComputePlanStatusDescription {
    waiting = 'Compute plan is waiting for parent tasks to end',
    todo = 'Compute plan is ready and waiting for available space to run',
    doing = 'Compute plan is processing',
    done = 'Compute plan finished without error',
    canceled = 'Compute plan was prematurely ended',
    failed = 'Compute plan has error',
}

export const statusDescriptionByComputePlanStatus: Record<
    ComputePlanStatus,
    ComputePlanStatusDescription
> = {
    [ComputePlanStatus.waiting]: ComputePlanStatusDescription.waiting,
    [ComputePlanStatus.todo]: ComputePlanStatusDescription.todo,
    [ComputePlanStatus.doing]: ComputePlanStatusDescription.doing,
    [ComputePlanStatus.done]: ComputePlanStatusDescription.done,
    [ComputePlanStatus.canceled]: ComputePlanStatusDescription.canceled,
    [ComputePlanStatus.failed]: ComputePlanStatusDescription.failed,
};

export interface ComputePlanT {
    key: string;
    owner: string;
    task_count: number;
    status: ComputePlanStatus;
    done_count: number;
    waiting_count: number;
    todo_count: number;
    doing_count: number;
    canceled_count: number;
    failed_count: number;
    delete_intermediary_models: boolean;
    tag: string;
    creation_date: string;
    metadata: { [key: string]: string };
    failed_task?: { key: string; category: TaskCategory };
}

export const isComputePlan = (
    computePlan: unknown
): computePlan is ComputePlanT => {
    if (typeof computePlan !== 'object') {
        return false;
    }

    // task_count and delete_intermediary_models props only exist for compute plan objects
    return (
        (computePlan as ComputePlanT).task_count !== undefined &&
        (computePlan as ComputePlanT).delete_intermediary_models !== undefined
    );
};
