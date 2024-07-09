import { AssetKindT } from '@/types/FunctionsTypes';
import { FunctionStep, StepInfoT } from '@/types/ProfilingTypes';

const ASSET_KIND_LABELS: Record<AssetKindT, string> = {
    ASSET_DATA_SAMPLE: 'data sample',
    ASSET_MODEL: 'model',
    ASSET_DATA_MANAGER: 'dataset',
    ASSET_PERFORMANCE: 'performance',
};
export const getAssetKindLabel = (kind: AssetKindT): string =>
    ASSET_KIND_LABELS[kind];

// Order is used for ordering function
export const functionStepsInfo: Record<FunctionStep, StepInfoT> = {
    [FunctionStep.imageBuilding]: {
        title: 'Building image',
        color: 'primary.500',
        description: 'Build the Docker image.',
    },
    [FunctionStep.functionSaving]: {
        title: 'Saving function',
        color: 'orange.500',
        description: 'Save the function in the local object repository.',
    },
};
