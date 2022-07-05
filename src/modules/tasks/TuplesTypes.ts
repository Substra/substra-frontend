import { AlgoT } from '@/modules/algos/AlgosTypes';
import {
    AssetType,
    MetadataT,
    PermissionsType,
    PermissionType,
} from '@/modules/common/CommonTypes';
import { DatasetStubType } from '@/modules/datasets/DatasetsTypes';

import { Model } from './ModelsTypes';

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

export enum ErrorType {
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

export const assetTypeByTaskCategory: Record<TaskCategory, AssetType> = {
    [TaskCategory.train]: 'traintuple',
    [TaskCategory.composite]: 'composite_traintuple',
    [TaskCategory.test]: 'testtuple',
    [TaskCategory.aggregate]: 'aggregatetuple',
    [TaskCategory.predict]: 'predicttuple',
};

interface BaseTupleStub {
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
    error_type?: ErrorType;
    logs_permission?: PermissionType;
    duration: number; // in seconds
}

interface BaseTuple extends BaseTupleStub {
    parent_tasks: (
        | TraintupleStub
        | CompositeTraintupleStub
        | AggregatetupleStub
    )[];
}

interface CompositeDetailsStub {
    data_manager_key: string;
    data_sample_keys: string[];
    head_permissions: PermissionsType;
    trunk_permissions: PermissionsType;
    models?: Model[];
}

interface CompositeDetails extends CompositeDetailsStub {
    data_manager: DatasetStubType;
}

export interface CompositeTraintupleStub extends BaseTupleStub {
    composite: CompositeDetailsStub;
}

export interface CompositeTraintuple extends BaseTuple {
    composite: CompositeDetails;
}

interface AggregateDetails {
    model_permissions: PermissionsType;
    models?: Model[];
}

export interface AggregatetupleStub extends BaseTupleStub {
    aggregate: AggregateDetails;
}

export interface Aggregatetuple extends BaseTuple {
    aggregate: AggregateDetails;
}

interface TestDetailsStub {
    data_manager_key: string;
    data_sample_keys: string[];
    // perfs contains a single key: the key of the algo used to compute the perf
    perfs?: Record<string, number>;
}

interface TestDetails extends TestDetailsStub {
    data_manager: DatasetStubType;
}

export interface TesttupleStub extends BaseTupleStub {
    test: TestDetailsStub;
}

export interface Testtuple extends BaseTuple {
    test: TestDetails;
}

interface TrainDetailsStub {
    data_manager_key: string;
    data_sample_keys: string[];
    model_permissions: PermissionsType;
    models?: Model[];
}

interface TrainDetails extends TrainDetailsStub {
    data_manager: DatasetStubType;
}

export interface TraintupleStub extends BaseTupleStub {
    train: TrainDetailsStub;
}

export interface Traintuple extends BaseTuple {
    train: TrainDetails;
}

interface PredictDetailsStub {
    data_manager_key: string;
    data_sample_keys: string[];
    models?: Model[];
    prediction_permissions: PermissionsType;
}

interface PredictDetails extends PredictDetailsStub {
    data_manager: DatasetStubType;
}

export interface PredicttupleStub extends BaseTupleStub {
    predict: PredictDetailsStub;
}

export interface Predicttuple extends BaseTuple {
    predict: PredictDetails;
}

export type AnyTupleT =
    | TraintupleStub
    | Traintuple
    | CompositeTraintupleStub
    | CompositeTraintuple
    | AggregatetupleStub
    | Aggregatetuple
    | TesttupleStub
    | Testtuple
    | PredicttupleStub
    | Predicttuple;
