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
    algorithm: FileT;
    category: 'ALGO_METRIC';
    metadata: MetadataT;
    creation_date: string;
}
