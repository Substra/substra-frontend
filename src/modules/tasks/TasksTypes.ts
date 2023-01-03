import { AlgoT, OutputT } from '@/modules/algos/AlgosTypes';
import {
    FileT,
    MetadataT,
    PermissionsT,
    PermissionT,
} from '@/modules/common/CommonTypes';

export enum TaskStatus {
    waiting = 'STATUS_WAITING',
    todo = 'STATUS_TODO',
    doing = 'STATUS_DOING',
    done = 'STATUS_DONE',
    canceled = 'STATUS_CANCELED',
    failed = 'STATUS_FAILED',
}

export enum TaskStatusDescription {
    waiting = 'Task is waiting for parent tasks to end',
    todo = 'Task is ready and waiting for available space to run',
    doing = 'Task is processing',
    done = 'Task finished without error',
    canceled = 'Task was prematurely ended',
    failed = 'Task has error',
}

export enum ErrorT {
    build = 'BUILD_ERROR',
    execution = 'EXECUTION_ERROR',
    internal = 'INTERNAL_ERROR',
}

export const statusDescriptionByTaskStatus: Record<
    TaskStatus,
    TaskStatusDescription
> = {
    [TaskStatus.waiting]: TaskStatusDescription.waiting,
    [TaskStatus.todo]: TaskStatusDescription.todo,
    [TaskStatus.doing]: TaskStatusDescription.doing,
    [TaskStatus.done]: TaskStatusDescription.done,
    [TaskStatus.canceled]: TaskStatusDescription.canceled,
    [TaskStatus.failed]: TaskStatusDescription.failed,
};

export type TaskInputT = {
    identifier: string;
    asset_key?: string;
    addressable?: FileT;
    permissions?: PermissionsT;
    parent_task_key?: string;
    parent_task_output_identifier?: string;
};

export type TaskT = {
    key: string;
    creation_date: string;
    algo: AlgoT;
    compute_plan_key: string;
    owner: string;
    metadata: MetadataT;
    status: TaskStatus;
    rank: number;
    tag: string;
    worker: string;
    start_date?: string;
    end_date?: string;
    error_type?: ErrorT;
    logs_permission?: PermissionT;
    duration: number; // in seconds
    inputs: TaskInputT[];
    outputs: { [name: string]: OutputT };
};
