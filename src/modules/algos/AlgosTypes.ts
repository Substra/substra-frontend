import { PermissionsType } from '@/modules/common/CommonTypes';

export interface APIAlgoType {
    key: string;
    name: string;
    owner: string;
    permissions: PermissionsType;
    description: {
        checksum: string;
        storage_address: string;
    };
    content: {
        checksum: string;
        storage_address: string;
    };
    metadata: { [key: string]: string };
}

export interface AlgoType extends APIAlgoType {
    type: 'standard' | 'aggregate' | 'composite';
}
