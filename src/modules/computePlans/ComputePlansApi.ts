import { ComputePlanT } from './ComputePlansTypes';
import { AxiosPromise } from 'axios';

import { PaginatedApiResponse } from '@/modules/common/CommonTypes';
import {
    AggregatetupleT,
    CompositeTraintupleT,
    TesttupleT,
    TraintupleT,
} from '@/modules/tasks/TuplesTypes';

import API, { getApiOptions } from '@/libs/request';
import { SearchFilterType } from '@/libs/searchFilter';

const URLS = {
    LIST: '/compute_plan/',
    RETRIEVE: '/compute_plan/__KEY__/',
    LIST_TESTTUPLES: '/compute_plan/__KEY__/testtuple/',
    LIST_TRAINTUPLES: '/compute_plan/__KEY__/traintuple/',
    LIST_COMPOSITE_TRAINTUPLES: '/compute_plan/__KEY__/composite_traintuple/',
    LIST_AGGREGATETUPLES: '/compute_plan/__KEY__/aggregatetuple/',
};

export const listComputePlans = (
    searchFilters: SearchFilterType[],
    page: number
): AxiosPromise<PaginatedApiResponse<ComputePlanT>> =>
    API.authenticatedGet(URLS.LIST, getApiOptions(searchFilters, page));

export const retrieveComputePlan = (key: string): AxiosPromise<ComputePlanT> =>
    API.authenticatedGet(URLS.RETRIEVE.replace('__KEY__', key));

export const listComputePlanTesttuples = (
    key: string,
    page?: number
): AxiosPromise<PaginatedApiResponse<TesttupleT>> => {
    return API.authenticatedGet(
        URLS.LIST_TESTTUPLES.replace('__KEY__', key),
        getApiOptions([], page)
    );
};
export const listComputePlanTraintuples = (
    key: string,
    page?: number
): AxiosPromise<PaginatedApiResponse<TraintupleT>> => {
    return API.authenticatedGet(
        URLS.LIST_TRAINTUPLES.replace('__KEY__', key),
        getApiOptions([], page)
    );
};
export const listComputePlanCompositeTraintuples = (
    key: string,
    page?: number
): AxiosPromise<PaginatedApiResponse<CompositeTraintupleT>> => {
    return API.authenticatedGet(
        URLS.LIST_COMPOSITE_TRAINTUPLES.replace('__KEY__', key),
        getApiOptions([], page)
    );
};
export const listComputePlanAggregatetuples = (
    key: string,
    page?: number
): AxiosPromise<PaginatedApiResponse<AggregatetupleT>> => {
    return API.authenticatedGet(
        URLS.LIST_AGGREGATETUPLES.replace('__KEY__', key),
        getApiOptions([], page)
    );
};

export default {
    listComputePlans,
    retrieveComputePlan,
    listComputePlanTesttuples,
    listComputePlanTraintuples,
    listComputePlanAggregatetuples,
    listComputePlanCompositeTraintuples,
};
