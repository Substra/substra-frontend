import { FileT, MetadataT, PermissionsT } from '@/modules/common/CommonTypes';
import { ModelT } from '@/modules/tasks/ModelsTypes';

export enum AssetKindT {
    dataSample = 'ASSET_DATA_SAMPLE',
    model = 'ASSET_MODEL',
    dataManager = 'ASSET_DATA_MANAGER',
    performance = 'ASSET_PERFORMANCE',
}

export type AlgoInputT = {
    kind: AssetKindT;
    multiple: boolean;
    optional: boolean;
};

export type AlgoOutputT = {
    kind: AssetKindT;
    multiple: boolean;
    value: number | ModelT;
};

export type AlgoT = {
    key: string;
    name: string;
    owner: string;
    permissions: PermissionsT;
    description: FileT;
    algorithm: FileT;
    metadata: MetadataT;
    creation_date: string;
    inputs: { [name: string]: AlgoInputT };
    outputs: { [name: string]: AlgoOutputT };
};
