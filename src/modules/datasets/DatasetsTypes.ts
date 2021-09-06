import {
    FileT,
    MetadataT,
    PermissionsType,
} from '@/modules/common/CommonTypes';

// DatasetStubType is returned when fetching a list of datasets
export interface DatasetStubType {
    key: string;
    name: string;
    owner: string;
    permissions: PermissionsType;
    objective_key: string;
    description: FileT;
    opener: FileT;
    type: string;
    creation_date: string;
    metadata: MetadataT;
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
