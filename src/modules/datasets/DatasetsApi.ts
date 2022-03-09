import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/libs/request';
import {
    APIListArgs,
    PaginatedApiResponse,
} from '@/modules//common/CommonTypes';

import { DatasetType, DatasetStubType } from './DatasetsTypes';

const URLS = {
    LIST: '/data_manager/',
    RETRIEVE: '/data_manager/__KEY__/',
};

export const listDatasets = (
    { searchFilters, page }: APIListArgs,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<DatasetStubType>> => {
    return API.authenticatedGet(URLS.LIST, {
        ...getApiOptions(searchFilters, page),
        ...config,
    });
};

export const retrieveDataset = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<DatasetType> =>
    API.authenticatedGet(URLS.RETRIEVE.replace('__KEY__', key), config);

export const retrieveOpener = (
    url: string,
    config: AxiosRequestConfig
): AxiosPromise<string> => API.authenticatedGet(url, config);
