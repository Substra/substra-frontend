import { FileT, MetadataT, PermissionsT } from '@/types/CommonTypes';
import { ModelT } from '@/types/ModelsTypes';

import { FunctionExecutionRundownT } from './ProfilingTypes';

export enum AssetKindT {
    dataSample = 'ASSET_DATA_SAMPLE',
    model = 'ASSET_MODEL',
    dataManager = 'ASSET_DATA_MANAGER',
    performance = 'ASSET_PERFORMANCE',
}

export type FunctionInputT = {
    kind: AssetKindT;
    multiple: boolean;
    optional: boolean;
};

type FunctionOutputT = {
    kind: AssetKindT;
    multiple: boolean;
    value: number | ModelT;
};

export type FunctionT = {
    key: string;
    name: string;
    owner: string;
    permissions: PermissionsT;
    description: FileT;
    archive: FileT;
    metadata: MetadataT;
    creation_date: string;
    inputs: { [name: string]: FunctionInputT };
    outputs: { [name: string]: FunctionOutputT };
};

export type FunctionProfilingT = {
    function_key: string;
    duration: number; // in microseconds
} & FunctionExecutionRundownT;
