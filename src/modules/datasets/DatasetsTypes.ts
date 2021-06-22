import { PermissionsType } from '@/modules/common/CommonTypes';

// DatasetStubType is returned when fetching a list of datasets
export interface DatasetStubType {
    key: string;
    name: string;
    owner: string;
    permissions: PermissionsType;
    description: {
        checksum: string;
        storage_address: string;
    };
    opener: {
        checksum: string;
        storage_address: string;
    };
}

// DatasetType is returned when fetching a single dataset
export interface DatasetType extends DatasetStubType {
    train_data_sample_keys: string[];
    test_data_sample_keys: string[];
}

export interface FilterType {
    asset: 'dataset';
    key: string;
    value: string;
}
