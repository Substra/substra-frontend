import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/libs/request';
import {
    APIListArgs,
    PaginatedApiResponse,
} from '@/modules/common/CommonTypes';

import { MetricType } from './MetricsTypes';

const URLS = {
    LIST: '/metric/',
    RETRIEVE: '/metric/__KEY__/',
};

export const listMetrics = (
    apiListArgs: APIListArgs,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<MetricType>> => {
    return API.authenticatedGet(URLS.LIST, {
        ...getApiOptions(apiListArgs),
        ...config,
    });
};

export const retrieveMetric = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<MetricType> =>
    API.authenticatedGet(URLS.RETRIEVE.replace('__KEY__', key), config);
