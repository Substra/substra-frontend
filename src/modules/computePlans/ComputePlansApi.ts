import { ComputePlanT } from './ComputePlansTypes';
import { AxiosPromise } from 'axios';

import { PaginatedApiResponse } from '@/modules/common/CommonTypes';
import {
    Aggregatetuple,
    CompositeTraintupleStub,
    TesttupleStub,
    TraintupleStub,
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
    searchFilters: SearchFilterType[],
    page: number,
    pageSize?: number
): AxiosPromise<PaginatedApiResponse<TesttupleStub>> => {
    return API.authenticatedGet(
        URLS.LIST_TESTTUPLES.replace('__KEY__', key),
        getApiOptions(searchFilters, page, pageSize)
    );
};
export const listComputePlanTraintuples = (
    key: string,
    searchFilters: SearchFilterType[],
    page: number,
    pageSize?: number
): AxiosPromise<PaginatedApiResponse<TraintupleStub>> => {
    return API.authenticatedGet(
        URLS.LIST_TRAINTUPLES.replace('__KEY__', key),
        getApiOptions(searchFilters, page, pageSize)
    );
};
export const listComputePlanCompositeTraintuples = (
    key: string,
    searchFilters: SearchFilterType[],
    page: number,
    pageSize?: number
): AxiosPromise<PaginatedApiResponse<CompositeTraintupleStub>> => {
    return API.authenticatedGet(
        URLS.LIST_COMPOSITE_TRAINTUPLES.replace('__KEY__', key),
        getApiOptions(searchFilters, page, pageSize)
    );
};
export const listComputePlanAggregatetuples = (
    key: string,
    searchFilters: SearchFilterType[],
    page: number,
    pageSize?: number
): AxiosPromise<PaginatedApiResponse<Aggregatetuple>> => {
    return API.authenticatedGet(
        URLS.LIST_AGGREGATETUPLES.replace('__KEY__', key),
        getApiOptions(searchFilters, page, pageSize)
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
