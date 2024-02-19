export enum ComputePlanStatus {
    created = 'PLAN_STATUS_CREATED',
    doing = 'PLAN_STATUS_DOING',
    done = 'PLAN_STATUS_DONE',
    canceled = 'PLAN_STATUS_CANCELED',
    failed = 'PLAN_STATUS_FAILED',
}

export enum ComputePlanStatusDescription {
    created = 'Compute plan is created',
    doing = 'Compute plan is processing',
    done = 'Compute plan finished without error',
    canceled = 'Compute plan was prematurely ended',
    failed = 'Compute plan has error',
}

export const statusDescriptionByComputePlanStatus: Record<
    ComputePlanStatus,
    ComputePlanStatusDescription
> = {
    [ComputePlanStatus.created]: ComputePlanStatusDescription.created,
    [ComputePlanStatus.doing]: ComputePlanStatusDescription.doing,
    [ComputePlanStatus.done]: ComputePlanStatusDescription.done,
    [ComputePlanStatus.canceled]: ComputePlanStatusDescription.canceled,
    [ComputePlanStatus.failed]: ComputePlanStatusDescription.failed,
};

export type ComputePlanStubT = {
    key: string;
    owner: string;
    task_count: number;
    status: ComputePlanStatus;
    done_count: number;
    waiting_parent_tasks_count: number;
    waiting_executor_slot_count: number;
    waiting_builder_slot_count: number;
    building_count: number;
    executing_count: number;
    canceled_count: number;
    failed_count: number;
    delete_intermediary_models: boolean;
    name: string;
    creation_date: string;
    creator: string;
    metadata: { [key: string]: string };
    start_date?: string;
    end_date?: string;
    duration: number; // in seconds
    estimated_end_date?: string;
};

export type ComputePlanT = ComputePlanStubT & {
    failed_task_key?: string;
};

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
