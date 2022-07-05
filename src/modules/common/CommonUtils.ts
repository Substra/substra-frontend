import { AxiosPromise } from 'axios';

import { capitalize as capitalizeString } from '@/libs/utils';

import { AssetType, PaginatedApiResponse } from './CommonTypes';

const ASSET_LABEL: Record<AssetType, string> = {
    algo: 'algorithm',
    dataset: 'dataset',
    composite_algo: 'algorithm',
    aggregate_algo: 'algorithm',
    testtuple: 'test task',
    traintuple: 'train task',
    composite_traintuple: 'composite train task',
    aggregatetuple: 'aggregate task',
    compute_plan: 'compute plan',
    predicttuple: 'predict task',
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

export const getAllPages = async <T>(
    getPage: (page: number) => AxiosPromise<PaginatedApiResponse<T>>,
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
