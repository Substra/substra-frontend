import { AlgoT, OutputT } from '@/modules/algos/AlgosTypes';
import {
    AssetT,
    FileT,
    MetadataT,
    PermissionsT,
    PermissionT,
} from '@/modules/common/CommonTypes';
import { DatasetStubT } from '@/modules/datasets/DatasetsTypes';

import { ModelT } from './ModelsTypes';

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

export enum TaskCategory {
    train = 'TASK_TRAIN',
    composite = 'TASK_COMPOSITE',
    test = 'TASK_TEST',
    aggregate = 'TASK_AGGREGATE',
    predict = 'TASK_PREDICT',
}

export const TASK_CATEGORY_SLUGS: Record<TaskCategory, string> = {
    [TaskCategory.test]: 'test',
    [TaskCategory.train]: 'train',
    [TaskCategory.composite]: 'composite_train',
    [TaskCategory.aggregate]: 'aggregate',
    [TaskCategory.predict]: 'predict',
};

export const assetTypeByTaskCategory: Record<TaskCategory, AssetT> = {
    [TaskCategory.train]: 'traintuple',
    [TaskCategory.composite]: 'composite_traintuple',
    [TaskCategory.test]: 'testtuple',
    [TaskCategory.aggregate]: 'aggregatetuple',
    [TaskCategory.predict]: 'predicttuple',
};

export type TaskInputT = {
    asset_key: string;
    identifier: string;
    addressable?: FileT;
    permissions?: PermissionsT;
    parent_task_key?: string;
    parent_task_output_identifier?: string;
};

type BaseTupleStubT = {
    key: string;
    category: TaskCategory;
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
    inputs: { [key: number]: TaskInputT };
    outputs: { [name: string]: OutputT };
};

type BaseTupleT = BaseTupleStubT & {
    parent_tasks: (
        | TraintupleStubT
        | CompositeTraintupleStubT
        | AggregatetupleStubT
    )[];
};

type CompositeDetailsStubT = {
    data_manager_key: string;
    data_sample_keys: string[];
    head_permissions: PermissionsT;
    trunk_permissions: PermissionsT;
    models?: ModelT[];
};

type CompositeDetailsT = CompositeDetailsStubT & {
    data_manager: DatasetStubT;
};

export type CompositeTraintupleStubT = BaseTupleStubT & {
    composite: CompositeDetailsStubT;
};

export type CompositeTraintupleT = BaseTupleT & {
    composite: CompositeDetailsT;
};

type AggregateDetailsT = {
    model_permissions: PermissionsT;
    models?: ModelT[];
};

export type AggregatetupleStubT = BaseTupleStubT & {
    aggregate: AggregateDetailsT;
};

export type AggregatetupleT = BaseTupleT & {
    aggregate: AggregateDetailsT;
};

type TestDetailsStubT = {
    data_manager_key: string;
    data_sample_keys: string[];
    // perfs contains a single key: the key of the algo used to compute the perf
    perfs?: Record<string, number>;
};

type TestDetailsT = TestDetailsStubT & {
    data_manager: DatasetStubT;
};

export type TesttupleStubT = BaseTupleStubT & {
    test: TestDetailsStubT;
};

export type TesttupleT = BaseTupleT & {
    test: TestDetailsT;
};

type TrainDetailsStubT = {
    data_manager_key: string;
    data_sample_keys: string[];
    model_permissions: PermissionsT;
    models?: ModelT[];
};

type TrainDetailsT = TrainDetailsStubT & {
    data_manager: DatasetStubT;
};

export type TraintupleStubT = BaseTupleStubT & {
    train: TrainDetailsStubT;
};

export type TraintupleT = BaseTupleT & {
    train: TrainDetailsT;
};

type PredictDetailsStubT = {
    data_manager_key: string;
    data_sample_keys: string[];
    models?: ModelT[];
    prediction_permissions: PermissionsT;
};

type PredictDetailsT = PredictDetailsStubT & {
    data_manager: DatasetStubT;
};

export type PredicttupleStubT = BaseTupleStubT & {
    predict: PredictDetailsStubT;
};

export type PredicttupleT = BaseTupleT & {
    predict: PredictDetailsT;
};

export type AnyTupleT =
    | TraintupleStubT
    | TraintupleT
    | CompositeTraintupleStubT
    | CompositeTraintupleT
    | AggregatetupleStubT
    | AggregatetupleT
    | TesttupleStubT
    | TesttupleT
    | PredicttupleStubT
    | PredicttupleT;

export type AnyFullTupleT =
    | TraintupleT
    | CompositeTraintupleT
    | AggregatetupleT
    | TesttupleT
    | PredicttupleT;
