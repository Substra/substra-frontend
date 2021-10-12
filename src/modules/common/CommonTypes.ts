export interface PermissionType {
    public: boolean;
    authorized_ids: string[];
}

export interface PermissionsType {
    process: PermissionType;
    download: PermissionType;
}

export type AssetType =
    | 'dataset'
    | 'metric'
    | 'algo'
    | 'composite_algo'
    | 'aggregate_algo'
    | 'testtuple'
    | 'traintuple'
    | 'composite_traintuple'
    | 'aggregatetuple'
    | 'compute_plan';

export type PaginatedApiResponse<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};

export type MetadataT = Record<string, string>;

export interface FileT {
    checksum: string;
    storage_address: string;
}
