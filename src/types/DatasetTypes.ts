import {
    FileT,
    MetadataT,
    PermissionsT,
    PermissionT,
} from '@/types/CommonTypes';

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
    data_sample_keys: string[];
};

export const isDatasetStubT = (
    datasetStub: unknown
): datasetStub is DatasetStubT => {
    if (typeof datasetStub !== 'object') {
        return false;
    }

    return (
        (datasetStub as DatasetStubT).key !== undefined &&
        (datasetStub as DatasetStubT).name !== undefined &&
        (datasetStub as DatasetStubT).owner !== undefined &&
        (datasetStub as DatasetStubT).permissions !== undefined &&
        (datasetStub as DatasetStubT).logs_permission !== undefined &&
        (datasetStub as DatasetStubT).description !== undefined &&
        (datasetStub as DatasetStubT).opener !== undefined &&
        (datasetStub as DatasetStubT).type !== undefined &&
        (datasetStub as DatasetStubT).creation_date !== undefined &&
        (datasetStub as DatasetStubT).metadata !== undefined
    );
};
