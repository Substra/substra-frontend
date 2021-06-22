export interface PermissionType {
    public: boolean;
    authorized_ids: string[];
}

export interface PermissionsType {
    process: PermissionType;
}

export enum AssetType {
    dataset = 'dataset',
    algo = 'algo',
    composite_algo = 'composite_algo',
    aggregate_algo = 'aggregate_algo',
    testtask = 'testtuple',
    traintask = 'traintuple',
    composite_traintask = 'composite_traintuple',
    aggregatetask = 'aggregatetuple',
    metric = 'objective',
}
