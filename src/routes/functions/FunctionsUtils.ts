import { AssetKindT } from '@/types/FunctionsTypes';

const ASSET_KIND_LABELS: Record<AssetKindT, string> = {
    ASSET_DATA_SAMPLE: 'data sample',
    ASSET_MODEL: 'model',
    ASSET_DATA_MANAGER: 'dataset',
    ASSET_PERFORMANCE: 'performance',
};
export const getAssetKindLabel = (kind: AssetKindT): string =>
    ASSET_KIND_LABELS[kind];
