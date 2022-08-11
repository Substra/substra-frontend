import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/libs/request';
import {
    APIListArgsProps,
    PaginatedApiResponseT,
} from '@/modules/common/CommonTypes';
import {
    ComputePlanStatisticsT,
    PerformanceT,
} from '@/modules/perf/PerformancesTypes';
import {
    AggregatetupleT,
    CompositeTraintupleStubT,
    PredicttupleT,
    TesttupleStubT,
    TraintupleStubT,
} from '@/modules/tasks/TuplesTypes';

import { ComputePlanStubT, ComputePlanT } from './ComputePlansTypes';

const URLS = {
    LIST: '/compute_plan/',
    RETRIEVE: '/compute_plan/__KEY__/',
    CANCEL: '/compute_plan/__KEY__/cancel/',
    LIST_TESTTUPLES: '/compute_plan/__KEY__/testtuple/',
    LIST_TRAINTUPLES: '/compute_plan/__KEY__/traintuple/',
    LIST_COMPOSITE_TRAINTUPLES: '/compute_plan/__KEY__/composite_traintuple/',
    LIST_AGGREGATETUPLES: '/compute_plan/__KEY__/aggregatetuple/',
    LIST_PREDICTTUPLES: '/compute_plan/__KEY__/predicttuple/',
    LIST_PERFORMANCES: '/compute_plan/__KEY__/perf/',
    EXPORT_PERFORMANCES: '/performance/export/',
};

type ListComputePlansArgsProps = APIListArgsProps & {
    match?: string;
};
export const listComputePlans = (
    apiListArgs: ListComputePlansArgsProps,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<ComputePlanStubT>> =>
    API.authenticatedGet(URLS.LIST, {
        ...getApiOptions(apiListArgs),
        ...config,
    });

export const retrieveComputePlan = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<ComputePlanT> =>
    API.authenticatedGet(URLS.RETRIEVE.replace('__KEY__', key), config);

export const cancelComputePlan = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<ComputePlanT> =>
    API.post(URLS.CANCEL.replace('__KEY__', key), config);

type APIListCPTuplesArgsProps = APIListArgsProps & {
    key: string;
};

export const listComputePlanTesttuples = (
    { key, ...apiListArgs }: APIListCPTuplesArgsProps,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<TesttupleStubT>> => {
    return API.authenticatedGet(URLS.LIST_TESTTUPLES.replace('__KEY__', key), {
        ...getApiOptions(apiListArgs),
        ...config,
    });
};
export const listComputePlanTraintuples = (
    { key, ...apiListArgs }: APIListCPTuplesArgsProps,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<TraintupleStubT>> => {
    return API.authenticatedGet(URLS.LIST_TRAINTUPLES.replace('__KEY__', key), {
        ...getApiOptions(apiListArgs),
        ...config,
    });
};
export const listComputePlanCompositeTraintuples = (
    { key, ...apiListArgs }: APIListCPTuplesArgsProps,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<CompositeTraintupleStubT>> => {
    return API.authenticatedGet(
        URLS.LIST_COMPOSITE_TRAINTUPLES.replace('__KEY__', key),
        {
            ...getApiOptions(apiListArgs),
            ...config,
        }
    );
};
export const listComputePlanAggregatetuples = (
    { key, ...apiListArgs }: APIListCPTuplesArgsProps,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<AggregatetupleT>> => {
    return API.authenticatedGet(
        URLS.LIST_AGGREGATETUPLES.replace('__KEY__', key),
        {
            ...getApiOptions(apiListArgs),
            ...config,
        }
    );
};

export const listComputePlanPredicttuples = (
    { key, ...apiListArgs }: APIListCPTuplesArgsProps,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<PredicttupleT>> => {
    return API.authenticatedGet(
        URLS.LIST_PREDICTTUPLES.replace('__KEY__', key),
        {
            ...getApiOptions(apiListArgs),
            ...config,
        }
    );
};

type PaginatedPerformanceResponseT = PaginatedApiResponseT<PerformanceT> & {
    compute_plan_statistics: ComputePlanStatisticsT;
};
export const listComputePlanPerformances = (
    { key, ...apiListArgs }: APIListCPTuplesArgsProps,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedPerformanceResponseT> => {
    return API.authenticatedGet(
        URLS.LIST_PERFORMANCES.replace('__KEY__', key),
        {
            ...getApiOptions(apiListArgs),
            ...config,
        }
    );
};

export const exportPerformances = (
    apiListArgs: APIListArgsProps,
    config?: AxiosRequestConfig
) => {
    return API.authenticatedGet(URLS.EXPORT_PERFORMANCES, {
        ...getApiOptions(apiListArgs),
        ...(config ?? {}),
        responseType: 'blob',
    });
};

export const updateComputePlan = (
    key: string,
    computePlan: { name: string },
    config: AxiosRequestConfig
): AxiosPromise<ComputePlanT> =>
    API.put(URLS.RETRIEVE.replace('__KEY__', key), computePlan, config);
