import {
    FileT,
    MetadataT,
    PermissionsType,
} from '@/modules/common/CommonTypes';

export enum AssetKindT {
    dataSample = 'ASSET_DATA_SAMPLE',
    model = 'ASSET_MODEL',
    dataManager = 'ASSET_DATA_MANAGER',
}
export type InputT = {
    kind: AssetKindT;
    multiple: boolean;
    optional: boolean;
};

type OutputT = {
    kind: AssetKindT;
    multiple: boolean;
};

export interface AlgoT {
    key: string;
    name: string;
    owner: string;
    permissions: PermissionsType;
    description: FileT;
    algorithm: FileT;
    metadata: MetadataT;
    creation_date: string;
    inputs: { [name: string]: InputT };
    outputs: { [name: string]: OutputT };
}
