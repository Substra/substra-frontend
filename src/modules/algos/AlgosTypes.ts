import {
    FileT,
    MetadataT,
    PermissionsType,
} from '@/modules/common/CommonTypes';

export enum AlgoCategory {
    simple = 'ALGO_SIMPLE',
    composite = 'ALGO_COMPOSITE',
    aggregate = 'ALGO_AGGREGATE',
}

export interface AlgoT {
    key: string;
    name: string;
    category: AlgoCategory;
    owner: string;
    permissions: PermissionsType;
    description: FileT;
    algorithm: FileT;
    metadata: MetadataT;
    creation_date: string;
}
