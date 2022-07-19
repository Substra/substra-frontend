import {
    FileT,
    MetadataT,
    PermissionsT,
    PermissionT,
} from '@/modules/common/CommonTypes';

// DatasetStubT is returned when fetching a list of datasets
export type DatasetStubT = {
    key: string;
    name: string;
    owner: string;
    permissions: PermissionsT;
    logs_permission: PermissionT;
    description: FileT;
    opener: FileT;
    type: string;
    creation_date: string;
    metadata: MetadataT;
};

// DatasetT is returned when fetching a single dataset
export type DatasetT = DatasetStubT & {
    train_data_sample_keys: string[];
    test_data_sample_keys: string[];
};
