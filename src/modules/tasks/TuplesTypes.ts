import { DatasetStubType } from '../datasets/DatasetsTypes';
import { MetricType } from '../metrics/MetricsTypes';
import { Model } from './ModelsTypes';

import { AlgoT } from '@/modules/algos/AlgosTypes';
import { MetadataT, PermissionsType } from '@/modules/common/CommonTypes';

export enum TupleStatus {
    waiting = 'STATUS_WAITING',
    todo = 'STATUS_TODO',
    doing = 'STATUS_DOING',
    done = 'STATUS_DONE',
    canceled = 'STATUS_CANCELED',
    failed = 'STATUS_FAILED',
    unknown = 'STATUS_UNKNOWN',
}

export enum TupleStatusDescription {
    waiting = 'Task is waiting for parent tasks to end',
    todo = 'Task is ready and waiting for available space to run',
    doing = 'Task is processing',
    done = 'Task finished without error',
    canceled = 'Task was prematurely ended',
    failed = 'Task has error',
    unknown = 'Task has an unknown status',
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
    [TupleStatus.unknown]: TupleStatusDescription.unknown,
};

export enum TaskCategory {
    train = 'TASK_TRAIN',
    composite = 'TASK_COMPOSITE',
    test = 'TASK_TEST',
    aggregate = 'TASK_AGGREGATE',
}

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
}

interface BaseTuple extends BaseTupleStub {
    parent_tasks: (
        | TraintupleStub
        | CompositeTraintupleStub
        | AggregatetupleStub
    )[];
}

export interface CompositeDetailsStub {
    data_manager_key: string;
    data_sample_keys: string[];
    head_permissions: PermissionsType;
    trunk_permissions: PermissionsType;
    models?: Model[];
}

export interface CompositeDetails extends CompositeDetailsStub {
    data_manager: DatasetStubType;
}

export interface CompositeTraintupleStub extends BaseTupleStub {
    composite: CompositeDetailsStub;
}

export interface CompositeTraintuple extends BaseTuple {
    composite: CompositeDetails;
}

export interface AggregateDetails {
    model_permissions: PermissionsType;
    models?: Model[];
}

export interface AggregatetupleStub extends BaseTupleStub {
    aggregate: AggregateDetails;
}

export interface Aggregatetuple extends BaseTuple {
    aggregate: AggregateDetails;
}

export interface TestDetailsStub {
    data_manager_key: string;
    data_sample_keys: string[];
    metric_keys: string[];
    perfs: Record<string, number>;
}

export interface TestDetails extends TestDetailsStub {
    data_manager: DatasetStubType;
    metrics: MetricType[];
}

export interface TesttupleStub extends BaseTupleStub {
    test: TestDetailsStub;
}

export interface Testtuple extends BaseTuple {
    test: TestDetails;
}

export interface TrainDetailsStub {
    data_manager_key: string;
    data_sample_keys: string[];
    model_permissions: PermissionsType;
    models?: Model[];
}

export interface TrainDetails extends TrainDetailsStub {
    data_manager: DatasetStubType;
}

export interface TraintupleStub extends BaseTupleStub {
    train: TrainDetailsStub;
}

export interface Traintuple extends BaseTuple {
    train: TrainDetails;
}

export type AnyTupleT =
    | TraintupleStub
    | Traintuple
    | CompositeTraintupleStub
    | CompositeTraintuple
    | AggregatetupleStub
    | Aggregatetuple
    | TesttupleStub
    | Testtuple;
