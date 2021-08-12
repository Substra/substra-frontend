import { DatasetType, DatasetStubType } from './DatasetsTypes';
import { AxiosPromise } from 'axios';

import { PaginatedApiResponse } from '@/modules//common/CommonTypes';

import API, { getApiOptions } from '@/libs/request';
import { SearchFilterType } from '@/libs/searchFilter';

const URLS = {
    LIST: '/data_manager/',
    RETRIEVE: '/data_manager/__KEY__/',
};

export const listDatasets = (
    searchFilters: SearchFilterType[],
    page?: number
): AxiosPromise<PaginatedApiResponse<DatasetStubType>> => {
    return API.get(URLS.LIST, getApiOptions(searchFilters, page));
};

export const retrieveDataset = (key: string): AxiosPromise<DatasetType> =>
    API.get(URLS.RETRIEVE.replace('__KEY__', key));

export const retrieveOpener = (url: string): AxiosPromise<string> =>
    API.get(url);

export default {
    listDatasets,
    retrieveDataset,
    retrieveOpener,
};
