import { NewsItemAssetKind } from './NewsFeedTypes';

const ASSET_KIND_LABELS: Record<NewsItemAssetKind, string> = {
    ASSET_ALGO: 'Algorithm',
    ASSET_COMPUTE_PLAN: 'Compute plan',
    ASSET_DATA_MANAGER: 'Dataset',
    ASSET_METRIC: 'Metric',
};

export const getAssetKindLabel = (assetKind: NewsItemAssetKind): string => {
    return ASSET_KIND_LABELS[assetKind];
};
