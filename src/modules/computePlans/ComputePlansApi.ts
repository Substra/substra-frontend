import { ComputePlanType } from './ComputePlansTypes';
import { AxiosPromise } from 'axios';

import API, { getApiOptions } from '@/libs/request';
import { SearchFilterType } from '@/libs/searchFilter';

const URLS = {
    LIST: '/compute_plan/',
    RETRIEVE: '/compute_plan/__KEY__',
};

export const listComputePlans = (
    searchFilters: SearchFilterType[]
): AxiosPromise<ComputePlanType[]> =>
    API.get(URLS.LIST, getApiOptions(searchFilters));

export const retrieveComputePlan = (
    key: string
): AxiosPromise<ComputePlanType> =>
    API.get(URLS.RETRIEVE.replace('__KEY__', key));

export default {
    listComputePlans,
    retrieveComputePlan,
};
