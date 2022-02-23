import { APIListArgs, PaginatedApiResponse } from '../common/CommonTypes';
import { MetricType } from './MetricsTypes';
import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/libs/request';

const URLS = {
    LIST: '/metric/',
    RETRIEVE: '/metric/__KEY__/',
};

export const listMetrics = (
    { searchFilters, page }: APIListArgs,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<MetricType>> => {
    return API.authenticatedGet(URLS.LIST, {
        ...getApiOptions(searchFilters, page),
        ...config,
    });
};

export const retrieveMetric = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<MetricType> =>
    API.authenticatedGet(URLS.RETRIEVE.replace('__KEY__', key), config);
