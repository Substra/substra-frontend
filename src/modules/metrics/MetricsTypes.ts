import {
    FileT,
    MetadataT,
    PermissionsType,
} from '@/modules/common/CommonTypes';

export interface MetricType {
    key: string;
    name: string;
    owner: string;
    permissions: PermissionsType;
    description: FileT;
    metrics_name: string;
    metrics: FileT;
    data_manager_key: string;
    data_sample_keys: string[];
    metadata: MetadataT;
    creation_date: string;
}
