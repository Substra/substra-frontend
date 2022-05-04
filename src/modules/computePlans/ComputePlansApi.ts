import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/libs/request';
import {
    APIListArgs,
    PaginatedApiResponse,
} from '@/modules/common/CommonTypes';
import { PerformanceType } from '@/modules/perf/PerformancesTypes';
import {
    Aggregatetuple,
    CompositeTraintupleStub,
    TesttupleStub,
    TraintupleStub,
} from '@/modules/tasks/TuplesTypes';

import { ComputePlanStub, ComputePlanT } from './ComputePlansTypes';

const URLS = {
    LIST: '/compute_plan/',
    RETRIEVE: '/compute_plan/__KEY__/',
    LIST_TESTTUPLES: '/compute_plan/__KEY__/testtuple/',
    LIST_TRAINTUPLES: '/compute_plan/__KEY__/traintuple/',
    LIST_COMPOSITE_TRAINTUPLES: '/compute_plan/__KEY__/composite_traintuple/',
    LIST_AGGREGATETUPLES: '/compute_plan/__KEY__/aggregatetuple/',
    LIST_PERFORMANCES: '/compute_plan/__KEY__/perf/',
};

interface ListComputePlansArgs extends APIListArgs {
    match?: string;
}
export const listComputePlans = (
    apiListArgs: ListComputePlansArgs,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<ComputePlanStub>> =>
    API.authenticatedGet(URLS.LIST, {
        ...getApiOptions(apiListArgs),
        ...config,
    });

export const retrieveComputePlan = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<ComputePlanT> =>
    API.authenticatedGet(URLS.RETRIEVE.replace('__KEY__', key), config);

type APIListCPTuplesArgs = APIListArgs & {
    key: string;
};

export const listComputePlanTesttuples = (
    { key, ...apiListArgs }: APIListCPTuplesArgs,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<TesttupleStub>> => {
    return API.authenticatedGet(URLS.LIST_TESTTUPLES.replace('__KEY__', key), {
        ...getApiOptions(apiListArgs),
        ...config,
    });
};
export const listComputePlanTraintuples = (
    { key, ...apiListArgs }: APIListCPTuplesArgs,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<TraintupleStub>> => {
    return API.authenticatedGet(URLS.LIST_TRAINTUPLES.replace('__KEY__', key), {
        ...getApiOptions(apiListArgs),
        ...config,
    });
};
export const listComputePlanCompositeTraintuples = (
    { key, ...apiListArgs }: APIListCPTuplesArgs,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<CompositeTraintupleStub>> => {
    return API.authenticatedGet(
        URLS.LIST_COMPOSITE_TRAINTUPLES.replace('__KEY__', key),
        {
            ...getApiOptions(apiListArgs),
            ...config,
        }
    );
};
export const listComputePlanAggregatetuples = (
    { key, ...apiListArgs }: APIListCPTuplesArgs,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<Aggregatetuple>> => {
    return API.authenticatedGet(
        URLS.LIST_AGGREGATETUPLES.replace('__KEY__', key),
        {
            ...getApiOptions(apiListArgs),
            ...config,
        }
    );
};

export const listComputePlanPerformances = (
    { key, ...apiListArgs }: APIListCPTuplesArgs,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<PerformanceType>> => {
    return API.authenticatedGet(
        URLS.LIST_PERFORMANCES.replace('__KEY__', key),
        {
            ...getApiOptions(apiListArgs),
            ...config,
        }
    );
};
