import { AxiosPromise } from 'axios';

import { capitalize as capitalizeString } from '@/libs/utils';

import { AssetT, PaginatedApiResponseT } from './CommonTypes';

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

export const getAllPages = async <T>(
    getPage: (page: number) => AxiosPromise<PaginatedApiResponseT<T>>,
    pageSize: number
): Promise<T[]> => {
    let res: T[] = [];
    let page = 1;
    let lastPage = 1;
    while (page <= lastPage) {
        const response = await getPage(page);
        res = [...res, ...response.data.results];
        lastPage = Math.ceil(response.data.count / pageSize);
        page += 1;
    }
    return res;
};
