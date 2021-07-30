import { PermissionsType } from '@/modules/common/CommonTypes';

export interface MetricType {
    key: string;
    name: string;
    owner: string;
    permissions: PermissionsType;
    description: {
        checksum: string;
        storage_address: string;
    };
    metrics: {
        name: string;
        checksum: string;
        storage_address: string;
    };
    test_dataset: null | {
        data_manager_key: string;
        data_sample_keys: string[];
        metadata: { [key: string]: string };
        worker: string;
    };
    metadata: { [key: string]: string };
    creation_date: string;
}
