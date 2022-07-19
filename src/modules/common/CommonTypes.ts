export type PermissionT = {
    public: boolean;
    authorized_ids: string[];
};

export type PermissionsT = {
    process: PermissionT;
    download: PermissionT;
};

export type AssetT =
    | 'dataset'
    | 'algo'
    | 'composite_algo'
    | 'aggregate_algo'
    | 'testtuple'
    | 'traintuple'
    | 'composite_traintuple'
    | 'aggregatetuple'
    | 'predicttuple'
    | 'compute_plan';

export type PaginatedApiResponseT<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
};

export type MetadataT = Record<string, string>;

export type FileT = {
    checksum: string;
    storage_address: string;
};

export type HasKeyT = {
    key: string;
};

export type APIListArgsProps = {
    page?: number;
    ordering?: string;
    pageSize?: number;
    match?: string;
} & { [param: string]: unknown };
