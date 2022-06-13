export interface OrganizationType {
    id: string;
    is_current: boolean;
}

export interface OrganizationInfoType {
    host: string;
    organization_id: string;
    version?: string;
    orchestrator_version?: string;
    chaincode_version?: string;
    channel?: string;
    config: {
        model_export_enabled?: boolean;
    };
}
