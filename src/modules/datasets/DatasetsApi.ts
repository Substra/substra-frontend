import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/libs/request';
import {
    APIListArgsT,
    PaginatedApiResponseT,
} from '@/modules//common/CommonTypes';

import { DatasetT, DatasetStubT } from './DatasetsTypes';

const URLS = {
    LIST: '/data_manager/',
    RETRIEVE: '/data_manager/__KEY__/',
};

export const listDatasets = (
    apiListArgs: APIListArgsT,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<DatasetStubT>> => {
    return API.authenticatedGet(URLS.LIST, {
        ...getApiOptions(apiListArgs),
        ...config,
    });
};

export const retrieveDataset = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<DatasetT> =>
    API.authenticatedGet(URLS.RETRIEVE.replace('__KEY__', key), config);

export const retrieveOpener = (
    url: string,
    config: AxiosRequestConfig
): AxiosPromise<string> => API.authenticatedGet(url, config);

export const updateDataset = (
    key: string,
    dataset: { name: string },
    config: AxiosRequestConfig
): AxiosPromise<DatasetT> =>
    API.put(URLS.RETRIEVE.replace('__KEY__', key), dataset, config);
