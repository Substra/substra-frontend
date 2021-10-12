import { PaginatedApiResponse } from '../common/CommonTypes';
import { MetricType } from './MetricsTypes';
import { AxiosPromise } from 'axios';

import API, { getApiOptions } from '@/libs/request';
import { SearchFilterType } from '@/libs/searchFilter';

const URLS = {
    LIST: '/metric/',
    RETRIEVE: '/metric/__KEY__/',
};

export const listMetrics = (
    searchFilters: SearchFilterType[],
    page?: number
): AxiosPromise<PaginatedApiResponse<MetricType>> => {
    return API.authenticatedGet(URLS.LIST, getApiOptions(searchFilters, page));
};

export const retrieveMetric = (key: string): AxiosPromise<MetricType> =>
    API.authenticatedGet(URLS.RETRIEVE.replace('__KEY__', key));

export default {
    listMetrics,
    retrieveMetric,
};
