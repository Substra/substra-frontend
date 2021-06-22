export interface PermissionType {
    public: boolean;
    authorized_ids: string[];
}

export interface PermissionsType {
    process: PermissionType;
}

export type AssetType =
    | 'dataset'
    | 'objective'
    | 'algo'
    | 'composite_algo'
    | 'aggregate_algo'
    | 'testtuple'
    | 'traintuple'
    | 'composite_traintuple'
    | 'aggregatetuple'
    | 'compute_plan';
