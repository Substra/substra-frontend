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
    address: FileT;
    metadata: MetadataT;
    creation_date: string;
}
