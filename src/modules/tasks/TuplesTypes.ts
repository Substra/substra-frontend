import { PermissionsType } from '@/modules/common/CommonTypes';

export enum TupleStatus {
    doing = 'doing',
    done = 'done',
    failed = 'failed',
    todo = 'todo',
    waiting = 'waiting',
    canceled = 'canceled',
}

export interface InModel {
    key: string;
    checksum: string;
    storage_address: string;
    traintuple_key: string;
}

interface OutHeadModel {
    key: string;
    checksum: string;
    storage_address?: string;
}

interface OutCompositeHeadModel {
    permissions: PermissionsType;
    out_model?: OutHeadModel;
}

interface OutCompositeTrunkModel {
    permissions: PermissionsType;
    out_model?: OutHeadModel;
}

interface TesttupleDataset {
    key: string;
    opener_checksum: string;
    data_sample_keys: string[];
    worker: string;
    perf: number;
}

interface Metric {
    checksum: string;
    storage_address: string;
}

interface TesttupleObjective {
    key: string;
    metrics: Metric;
}

interface TraintupleAlgo {
    key: string;
    checksum: string;
    storage_address: string;
    name: string;
}

interface TraintupleDataset {
    key: string;
    worker: string;
    data_sample_keys: string[];
    opener_checksum: string;
    metadata: { [key: string]: string };
}

interface OutModel {
    key: string;
    checksum: string;
    storage_address: string;
}

interface BaseTupleT {
    algo: TraintupleAlgo;
    compute_plan_key: string;
    creator: string;
    key: string;
    log: string;
    metadata: { [key: string]: string };
    status: TupleStatus;
}

export type TesttupleTraintupleType =
    | 'traintuple'
    | 'composite_traintuple'
    | 'aggregatetuple';

export interface CompositeTraintupleT extends BaseTupleT {
    dataset: TraintupleDataset;
    in_head_model?: InModel;
    in_trunk_model?: InModel;
    out_head_model: OutCompositeHeadModel;
    out_trunk_model: OutCompositeTrunkModel;
    rank?: number;
    tag: string;
}

export interface AggregatetupleT extends BaseTupleT {
    in_models: InModel[] | null;
    out_model?: OutModel;
    permissions: PermissionsType;
    rank?: string;
    tag: string;
    worker: string;
}

export interface TesttupleT extends BaseTupleT {
    certified: boolean;
    dataset: TesttupleDataset;
    objective: TesttupleObjective;
    rank: number;
    tag?: string;
    traintuple_key: string;
    traintuple_type: TesttupleTraintupleType;
}

export interface TraintupleT extends BaseTupleT {
    dataset: TraintupleDataset;
    in_models: InModel[] | null;
    out_model: OutModel;
    permissions: PermissionsType;
    rank: number;
    tags: string;
}

export type AnyTupleT =
    | TraintupleT
    | CompositeTraintupleT
    | AggregatetupleT
    | TesttupleT;
