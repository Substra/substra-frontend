import { ComputePlanStub, ComputePlanT } from './ComputePlansTypes';
import { AxiosPromise, AxiosRequestConfig } from 'axios';

import {
    APIListArgs,
    PaginatedApiResponse,
} from '@/modules/common/CommonTypes';
import {
    Aggregatetuple,
    CompositeTraintupleStub,
    TesttupleStub,
    TraintupleStub,
} from '@/modules/tasks/TuplesTypes';

import API, { getApiOptions } from '@/libs/request';

const URLS = {
    LIST: '/compute_plan/',
    RETRIEVE: '/compute_plan/__KEY__/',
    LIST_TESTTUPLES: '/compute_plan/__KEY__/testtuple/',
    LIST_TRAINTUPLES: '/compute_plan/__KEY__/traintuple/',
    LIST_COMPOSITE_TRAINTUPLES: '/compute_plan/__KEY__/composite_traintuple/',
    LIST_AGGREGATETUPLES: '/compute_plan/__KEY__/aggregatetuple/',
};

export const listComputePlans = (
    { searchFilters, page }: APIListArgs,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<ComputePlanStub>> =>
    API.authenticatedGet(URLS.LIST, {
        ...getApiOptions(searchFilters, page),
        ...config,
    });

export const retrieveComputePlan = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<ComputePlanT> =>
    API.authenticatedGet(URLS.RETRIEVE.replace('__KEY__', key), config);

export type APIListCPTuplesArgs = APIListArgs & {
    key: string;
    pageSize?: number;
};

export const listComputePlanTesttuples = (
    { key, searchFilters, page, pageSize }: APIListCPTuplesArgs,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<TesttupleStub>> => {
    return API.authenticatedGet(URLS.LIST_TESTTUPLES.replace('__KEY__', key), {
        ...getApiOptions(searchFilters, page, pageSize),
        ...config,
    });
};
export const listComputePlanTraintuples = (
    { key, searchFilters, page, pageSize }: APIListCPTuplesArgs,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<TraintupleStub>> => {
    return API.authenticatedGet(URLS.LIST_TRAINTUPLES.replace('__KEY__', key), {
        ...getApiOptions(searchFilters, page, pageSize),
        ...config,
    });
};
export const listComputePlanCompositeTraintuples = (
    { key, searchFilters, page, pageSize }: APIListCPTuplesArgs,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<CompositeTraintupleStub>> => {
    return API.authenticatedGet(
        URLS.LIST_COMPOSITE_TRAINTUPLES.replace('__KEY__', key),
        {
            ...getApiOptions(searchFilters, page, pageSize),
            ...config,
        }
    );
};
export const listComputePlanAggregatetuples = (
    { key, searchFilters, page, pageSize }: APIListCPTuplesArgs,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<Aggregatetuple>> => {
    return API.authenticatedGet(
        URLS.LIST_AGGREGATETUPLES.replace('__KEY__', key),
        {
            ...getApiOptions(searchFilters, page, pageSize),
            ...config,
        }
    );
};
