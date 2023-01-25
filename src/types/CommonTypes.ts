export type PermissionT = {
    public: boolean;
    authorized_ids: string[];
};

export type PermissionsT = {
    process: PermissionT;
    download: PermissionT;
};

export type AssetT = 'dataset' | 'function' | 'task' | 'compute_plan' | 'user';

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

export type APIListArgsT = {
    page?: number;
    ordering?: string;
    pageSize?: number;
    match?: string;
} & { [param: string]: unknown };

export type APIRetrieveListArgsT = APIListArgsT & {
    key: string;
};
