import { MetadataT, PermissionT } from './CommonTypes';
import { DataSampleT } from './DataSampleTypes';
import { DatasetStubT } from './DatasetTypes';
import { FunctionT, AssetKindT, FunctionOutputT } from './FunctionsTypes';
import { ModelT } from './ModelsTypes';
import { PerformanceAssetT } from './PerformancesTypes';

export enum TaskStatus {
    waiting = 'STATUS_WAITING',
    todo = 'STATUS_TODO',
    doing = 'STATUS_DOING',
    done = 'STATUS_DONE',
    canceled = 'STATUS_CANCELED',
    failed = 'STATUS_FAILED',
}

export const taskStatusOrder: TaskStatus[] = [
    TaskStatus.done,
    TaskStatus.doing,
    TaskStatus.canceled,
    TaskStatus.failed,
    TaskStatus.todo,
    TaskStatus.waiting,
];

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
