import { MetadataT, PermissionsT, PermissionT } from './CommonTypes';
import { DataSampleT } from './DataSampleTypes';
import { DatasetStubT } from './DatasetTypes';
import { FunctionT, AssetKindT } from './FunctionsTypes';
import { ModelT } from './ModelsTypes';
import { PerformanceAssetT } from './PerformancesTypes';
import { ExecutionRundownT, TaskStep } from './ProfilingTypes';

export enum TaskStatus {
    waitingExecutorSlot = 'STATUS_WAITING_FOR_EXECUTOR_SLOT',
    waitingParentTasks = 'STATUS_WAITING_FOR_PARENT_TASKS',
    waitingBuilderSlot = 'STATUS_WAITING_FOR_BUILDER_SLOT',
    building = 'STATUS_BUILDING',
    executing = 'STATUS_EXECUTING',
    done = 'STATUS_DONE',
    canceled = 'STATUS_CANCELED',
    failed = 'STATUS_FAILED',
}

export const taskStatusOrder: TaskStatus[] = [
    TaskStatus.done,
    TaskStatus.executing,
    TaskStatus.building,
    TaskStatus.canceled,
    TaskStatus.failed,
    TaskStatus.waitingExecutorSlot,
    TaskStatus.waitingParentTasks,
    TaskStatus.waitingBuilderSlot,
];

export enum TaskStatusDescription {
    waitingParentTasks = 'Task is waiting for parent tasks to end',
    waitingExecutorSlot = 'Task is waiting for an available executor to run',
    waitingBuilderSlot = 'Task function is waiting for an available builder to build',
    executing = 'Task is executing',
    building = 'Task function is being built',
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
    [TaskStatus.waitingBuilderSlot]: TaskStatusDescription.waitingBuilderSlot,
    [TaskStatus.building]: TaskStatusDescription.building,
    [TaskStatus.waitingParentTasks]: TaskStatusDescription.waitingParentTasks,
    [TaskStatus.waitingExecutorSlot]: TaskStatusDescription.waitingExecutorSlot,
    [TaskStatus.executing]: TaskStatusDescription.executing,
    [TaskStatus.done]: TaskStatusDescription.done,
    [TaskStatus.canceled]: TaskStatusDescription.canceled,
    [TaskStatus.failed]: TaskStatusDescription.failed,
};

export type TaskInputT = {
    identifier: string;
    asset_key?: string;
    parent_task_key?: string;
    parent_task_output_identifier?: string;
};

export type TaskOutputT = {
    permissions: PermissionsT;
    transient: boolean;
};

// IO types are used for task inputs/outputs assets
type BaseIOT = {
    identifier: string;
    kind: AssetKindT;
};

type DatasetIOT = BaseIOT & {
    kind: AssetKindT.dataManager;
    asset: DatasetStubT;
};

type DatasampleIOT = BaseIOT & {
    kind: AssetKindT.dataSample;
    asset: DataSampleT;
};

type ModelIOT = BaseIOT & {
    kind: AssetKindT.model;
    asset: ModelT;
};

type PerformanceIOT = BaseIOT & {
    kind: AssetKindT.performance;
    asset: PerformanceAssetT;
};

export type TaskIOT = DatasetIOT | DatasampleIOT | ModelIOT | PerformanceIOT;

export type TaskT = {
    key: string;
    creation_date: string;
    function: FunctionT;
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
    outputs: { [identifier: string]: TaskOutputT };
};

export type TaskProfilingT = {
    compute_task_key: string;
    task_duration: number; // in microseconds
} & ExecutionRundownT<TaskStep>;
