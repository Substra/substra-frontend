import { PermissionsType } from '@/modules/common/CommonTypes';

export enum TaskStatus {
    doing = 'doing',
    done = 'done',
    failed = 'failed',
    todo = 'todo',
    waiting = 'waiting',
    canceled = 'canceled',
}

interface InHeadModel {
    key: string;
    checksum: string;
    storage_address?: string;
    traintuple_key?: string;
}

interface InModel {
    key: string;
    checksum: string;
    storage_address?: string;
    traintuple_key?: string;
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

enum Type {
    Testtask = 'testtuple',
    Traintask = 'traintuple',
    Aggregatetask = 'aggregatetuple',
    CompositeTraintask = 'composite_traintuple',
}

interface TestTaskDataset {
    key: string;
    opener_checksum: string;
    data_sample_keys: string[];
    worker: string;
    metadata?: { [key: string]: string };
}

interface Metric {
    name?: string;
    checksum: string;
    storage_address: string;
}

interface TestTaskObjective {
    key: string;
    metrics: Metric;
}

export interface TrainTaskAlgoType {
    key: string;
    checksum: string;
    storage_address: string;
    name: string;
}

interface TrainTaskDatasetType {
    key: string;
    worker: string;
    data_sample_keys: string[];
    opener_checksum: string;
    metadata: { [key: string]: string };
}

export interface OutModelType {
    key: string;
    checksum: string;
    storage_address: string;
}

export interface TaskType {
    algo: TrainTaskAlgoType;
    compute_plan_key: string;
    creator: string;
    key: string;
    log: string;
    metadata: { [key: string]: string };
    status: TaskStatus;
}

export interface CompositeTrainTaskType extends TaskType {
    in_head_model?: InHeadModel;
    in_trunk_model?: InModel;
    out_head_model: OutCompositeHeadModel;
    out_trunk_model: OutCompositeTrunkModel;
    rank?: number;
    tag: string;
}

export interface AggregateTaskType extends TaskType {
    in_models: string[];
    out_model?: OutModelType;
    permissions: PermissionsType;
    rank?: string;
    tag: string;
    worker: string;
}

export interface TestTaskType extends TaskType {
    certified: boolean;
    dataset: TestTaskDataset;
    objective: TestTaskObjective;
    rank: number;
    tag?: string;
    traintuple_key: string;
    traintuple_type: Type;
}

export interface TrainTaskType extends TaskType {
    dataset: TrainTaskDatasetType;
    in_models: string[];
    out_model: OutModelType;
    permissions: PermissionsType;
    rank: number;
    tags: string;
}
