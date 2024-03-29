import { NewsItemAssetKind } from '@/types/NewsFeedTypes';

const ASSET_KIND_LABELS: Record<NewsItemAssetKind, string> = {
    ASSET_COMPUTE_PLAN: 'Compute plan',
    ASSET_DATA_MANAGER: 'Dataset',
};

export const getAssetKindLabel = (assetKind: NewsItemAssetKind): string => {
    return ASSET_KIND_LABELS[assetKind];
};

// Interval to actualize unseen news count, important news & refresh banner
export const ACTUALIZE_NEWS_INTERVAL = 60000; // 1min
