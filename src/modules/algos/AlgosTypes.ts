import { PermissionsType } from '@/modules/common/CommonTypes';

export interface AlgoT {
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
    creation_date: string;
}
