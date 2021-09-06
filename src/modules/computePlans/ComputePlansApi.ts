import { ComputePlanT } from './ComputePlansTypes';
import { AxiosPromise } from 'axios';

import { PaginatedApiResponse } from '@/modules/common/CommonTypes';

import API, { getApiOptions } from '@/libs/request';
import { SearchFilterType } from '@/libs/searchFilter';

const URLS = {
    LIST: '/compute_plan/',
    RETRIEVE: '/compute_plan/__KEY__',
};

export const listComputePlans = (
    searchFilters: SearchFilterType[],
    page: number
): AxiosPromise<PaginatedApiResponse<ComputePlanT>> =>
    API.get(URLS.LIST, getApiOptions(searchFilters, page));

export const retrieveComputePlan = (key: string): AxiosPromise<ComputePlanT> =>
    API.get(URLS.RETRIEVE.replace('__KEY__', key));

export default {
    listComputePlans,
    retrieveComputePlan,
};
