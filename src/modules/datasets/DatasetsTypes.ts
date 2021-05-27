export interface PermissionType {
    public: boolean;
    authorized_ids: string[];
}

export interface PermissionsType {
    process: PermissionType;
}

export interface DatasetType {
    key: string;
    name: string;
    owner: string;
    permissions: PermissionsType;
}
