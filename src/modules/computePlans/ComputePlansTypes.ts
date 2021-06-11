export interface ComputePlanType {
    clean_models: boolean;
    done_count: number;
    key: string;
    status: string;
    tag: string;
    testtuple_keys: string[];
    traintuple_keys: string[];
    aggregatetuple_keys: string[];
    composite_traintuple_keys: string[];
    tuple_count: number;
}
