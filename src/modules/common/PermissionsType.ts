export interface PermissionType {
    public: boolean;
    authorized_ids: string[];
}

export interface PermissionsType {
    process: PermissionType;
}
