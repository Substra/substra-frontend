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
    testtuple = 'testtuple',
    traintuple = 'traintuple',
    composite_traintuple = 'composite_traintuple',
    aggregatetuple = 'aggregatetuple',
    metric = 'objective',
}
