import { capitalize as capitalizeString } from '@/libs/utils';

import { AssetT } from './CommonTypes';

const ASSET_LABEL: Record<AssetT, string> = {
    function: 'function',
    dataset: 'dataset',
    task: 'task',
    compute_plan: 'compute plan',
    user: 'user',
};

export const getAssetLabel = (
    asset: AssetT,
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
