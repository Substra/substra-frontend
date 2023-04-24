import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/api/request';
import { API_PATHS, compilePath } from '@/paths';
import { APIListArgsT, PaginatedApiResponseT } from '@/types/CommonTypes';
import { DatasetT, DatasetStubT } from '@/types/DatasetTypes';

export const listDatasets = (
    apiListArgs: APIListArgsT,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<DatasetStubT>> => {
    return API.authenticatedGet(API_PATHS.DATASETS, {
        ...getApiOptions(apiListArgs),
        ...config,
    });
};

export const retrieveDataset = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<DatasetT> =>
    API.authenticatedGet(compilePath(API_PATHS.DATASET, { key }), config);

export const retrieveOpener = (
    url: string,
    config: AxiosRequestConfig
): AxiosPromise<string> => API.authenticatedGet(url, config);

export const updateDataset = (
    key: string,
    dataset: { name: string },
    config: AxiosRequestConfig
): AxiosPromise<DatasetT> =>
    API.put(compilePath(API_PATHS.DATASET, { key }), dataset, config);
