import { TupleType } from '@/modules/tasks/TuplesTypes';

export interface ComputePlanType {
    creation_date: string;
    clean_models: boolean;
    done_count: number;
    key: string;
    status: string;
    tag: string;
    testtuple_keys: string[];
    traintuple_keys: string[];
    aggregatetuple_keys: string[];
    composite_traintuple_keys: string[];
    failed_tuple: { key?: string; type?: TupleType };
    tuple_count: number;
    metadata: { [key: string]: string };
}
