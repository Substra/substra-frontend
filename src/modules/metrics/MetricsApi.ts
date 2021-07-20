import { MetricType } from './MetricsTypes';
import { AxiosPromise } from 'axios';

import API, { getApiOptions } from '@/libs/request';
import { SearchFilterType } from '@/libs/searchFilter';

const URLS = {
    LIST: '/objective/',
    RETRIEVE: '/objective/__KEY__/',
};

export const listMetrics = (
    searchFilters: SearchFilterType[]
): AxiosPromise<MetricType[]> => {
    return API.get(URLS.LIST, getApiOptions(searchFilters));
};

export const retrieveMetric = (key: string): AxiosPromise<MetricType> =>
    API.get(URLS.RETRIEVE.replace('__KEY__', key));

export default {
    listMetrics,
    retrieveMetric,
};
