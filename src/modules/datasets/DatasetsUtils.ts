import { DatasetStubT } from './DatasetsTypes';

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
