import { MetadataT, PermissionT } from './CommonTypes';
import { DataSampleT } from './DataSampleTypes';
import { DatasetStubT } from './DatasetTypes';
import { FunctionT, AssetKindT, FunctionOutputT } from './FunctionsTypes';
import { ModelT } from './ModelsTypes';
import { PerformanceAssetT } from './PerformancesTypes';

export enum TaskStatus {
    waitingExecutorSlot = "STATUS_WAITING_FOR_EXECUTOR_SLOT",
    waitingParentTasks = "STATUS_WAITING_FOR_PARENT_TASKS",
    waitingBuilderSlot = "STATUS_WAITING_FOR_BUILDER_SLOT",
    building = "STATUS_BUILDING",
    doing = 'STATUS_DOING',
    done = 'STATUS_DONE',
    canceled = 'STATUS_CANCELED',
    failed = 'STATUS_FAILED',
}

export const taskStatusOrder: TaskStatus[] = [
    TaskStatus.done,
    TaskStatus.doing,
    TaskStatus.building,
    TaskStatus.canceled,
    TaskStatus.failed,
    TaskStatus.waitingExecutorSlot,
    TaskStatus.waitingBuilderSlot,
    TaskStatus.waitingParentTasks,
];

export enum TaskStatusDescription {
    waitingParentTasks = 'Task is waiting for parent tasks to end',
    waitingExecutorSlot = 'Task is waiting for an available executor to run',
    waitingBuilderSlot = 'Task function is waiting for an available builder to build',
    doing = 'Task is executing',
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
    [TaskStatus.doing]: TaskStatusDescription.doing,
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
    outputs: { [name: string]: FunctionOutputT };
};

export enum TaskStep {
    imageBuilding = 'build_image',
    inputsPreparation = 'prepare_inputs',
    taskExecution = 'task_execution',
    outputsSaving = 'save_outputs',
}

export type StepInfoT = {
    title: string;
    color: string;
    description: string;
};

export type StepT = {
    step: TaskStep;
    duration: number; // in microseconds
};
export type TaskProfilingT = {
    compute_task_key: string;
    task_duration: number; // in microseconds
    execution_rundown: StepT[];
};
