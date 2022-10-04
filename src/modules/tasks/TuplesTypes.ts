import { AlgoT, OutputT } from '@/modules/algos/AlgosTypes';
import {
    FileT,
    MetadataT,
    PermissionsT,
    PermissionT,
} from '@/modules/common/CommonTypes';

export enum TupleStatus {
    waiting = 'STATUS_WAITING',
    todo = 'STATUS_TODO',
    doing = 'STATUS_DOING',
    done = 'STATUS_DONE',
    canceled = 'STATUS_CANCELED',
    failed = 'STATUS_FAILED',
}

export enum TupleStatusDescription {
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

export const statusDescriptionByTupleStatus: Record<
    TupleStatus,
    TupleStatusDescription
> = {
    [TupleStatus.waiting]: TupleStatusDescription.waiting,
    [TupleStatus.todo]: TupleStatusDescription.todo,
    [TupleStatus.doing]: TupleStatusDescription.doing,
    [TupleStatus.done]: TupleStatusDescription.done,
    [TupleStatus.canceled]: TupleStatusDescription.canceled,
    [TupleStatus.failed]: TupleStatusDescription.failed,
};

export type TaskInputT = {
    identifier: string;
    asset_key?: string;
    addressable?: FileT;
    permissions?: PermissionsT;
    parent_task_key?: string;
    parent_task_output_identifier?: string;
};

export type TupleT = {
    key: string;
    creation_date: string;
    algo: AlgoT;
    compute_plan_key: string;
    owner: string;
    metadata: MetadataT;
    status: TupleStatus;
    rank: number;
    tag: string;
    parent_task_keys: string[];
    worker: string;
    start_date?: string;
    end_date?: string;
    error_type?: ErrorT;
    logs_permission?: PermissionT;
    duration: number; // in seconds
    inputs: TaskInputT[];
    outputs: { [name: string]: OutputT };
};
