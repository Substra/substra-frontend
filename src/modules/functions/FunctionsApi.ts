import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/libs/request';
import {
    APIListArgsT,
    PaginatedApiResponseT,
} from '@/modules/common/CommonTypes';

import { FunctionT } from './FunctionsTypes';

const URLS = {
    LIST: '/function/',
    RETRIEVE: '/function/__KEY__/',
};

export const listFunctions = (
    apiListArgs: APIListArgsT,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<FunctionT>> =>
    API.authenticatedGet(URLS.LIST, {
        ...getApiOptions(apiListArgs),
        ...config,
    });

export const retrieveFunction = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<FunctionT> =>
    API.authenticatedGet(URLS.RETRIEVE.replace('__KEY__', key), config);

export const updateFunction = (
    key: string,
    func: { name: string },
    config: AxiosRequestConfig
): AxiosPromise<FunctionT> =>
    API.put(URLS.RETRIEVE.replace('__KEY__', key), func, config);
