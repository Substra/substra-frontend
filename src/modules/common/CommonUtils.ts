import { AssetType } from './CommonTypes';

import { capitalize as capitalizeString } from '@/libs/utils';

const ASSET_LABEL: Record<AssetType, string> = {
    algo: 'algorithm',
    dataset: 'dataset',
    metric: 'metric',
    composite_algo: 'algorithm',
    aggregate_algo: 'algorithm',
    testtuple: 'test task',
    traintuple: 'train task',
    composite_traintuple: 'composite train task',
    aggregatetuple: 'aggregate task',
    compute_plan: 'compute plan',
};

export const getAssetLabel = (
    asset: AssetType,
    { capitalize, plural }: { capitalize?: boolean; plural?: boolean }
): string => {
    let label = ASSET_LABEL[asset];
    if (capitalize) {
        label = capitalizeString(label);
    }
    if (plural) {
        label = label + 's';
    }
    return label;
};
