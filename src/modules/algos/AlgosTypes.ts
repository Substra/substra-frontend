import {
    FileT,
    MetadataT,
    PermissionsType,
} from '@/modules/common/CommonTypes';

export interface AlgoT {
    key: string;
    name: string;
    owner: string;
    permissions: PermissionsType;
    description: FileT;
    algorithm: FileT;
    metadata: MetadataT;
    creation_date: string;
}
