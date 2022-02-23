import { AlgoT } from './AlgosTypes';
import { AxiosPromise, AxiosRequestConfig } from 'axios';

import {
    APIListArgs,
    PaginatedApiResponse,
} from '@/modules/common/CommonTypes';

import API, { getApiOptions } from '@/libs/request';

const URLS = {
    LIST: '/algo/',
    RETRIEVE: '/algo/__KEY__/',
};

export const listAlgos = (
    { searchFilters, page }: APIListArgs,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<AlgoT>> =>
    API.authenticatedGet(URLS.LIST, {
        ...getApiOptions(searchFilters, page),
        ...config,
    });

export const retrieveAlgo = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<AlgoT> =>
    API.authenticatedGet(URLS.RETRIEVE.replace('__KEY__', key), config);
