export interface NodeType {
    id: string;
    is_current: boolean;
}

export interface NodeInfoType {
    host: string;
    node_id: string;
    version?: string;
    channel?: string;
    config: {
        model_export_enabled?: boolean;
    };
}
