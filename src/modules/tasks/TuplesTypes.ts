import { Model } from './ModelsTypes';

import { AlgoT } from '@/modules/algos/AlgosTypes';
import { MetadataT, PermissionsType } from '@/modules/common/CommonTypes';

export enum TupleStatus {
    doing = 'STATUS_DOING',
    done = 'STATUS_DONE',
    failed = 'STATUS_FAILED',
    todo = 'STATUS_TODO',
    waiting = 'STATUS_WAITING',
    canceled = 'STATUS_CANCELED',
}

export enum TaskCategory {
    train = 'TASK_TRAIN',
    composite = 'TASK_COMPOSITE',
    test = 'TASK_TEST',
    aggregate = 'TASK_AGGREGATE',
}

interface BaseTupleT {
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
}

export interface CompositeTraintupleT extends BaseTupleT {
    composite: {
        data_manager_key: string;
        data_sample_keys: string[];
        head_permissions: PermissionsType;
        trunk_permissions: PermissionsType;
        models?: Model[];
    };
}

export interface AggregatetupleT extends BaseTupleT {
    aggregate: {
        model_permissions: PermissionsType;
        models?: Model[];
    };
}

export interface TesttupleT extends BaseTupleT {
    test: {
        data_manager_key: string;
        data_sample_keys: string[];
        objective_key: string;
        certified: boolean;
        perf: number;
    };
}

export interface TraintupleT extends BaseTupleT {
    train: {
        data_manager_key: string;
        data_sample_keys: string[];
        model_permissions: PermissionsType;
        models?: Model[];
    };
}

export type AnyTupleT =
    | TraintupleT
    | CompositeTraintupleT
    | AggregatetupleT
    | TesttupleT;
