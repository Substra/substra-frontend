import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/libs/request';
import {
    APIListArgsT,
    PaginatedApiResponseT,
} from '@/modules/common/CommonTypes';
import {
    ComputePlanStatisticsT,
    PerformanceT,
} from '@/modules/perf/PerformancesTypes';
import { TupleT } from '@/modules/tasks/TuplesTypes';

import { ComputePlanStubT, ComputePlanT } from './ComputePlansTypes';

const URLS = {
    LIST: '/compute_plan/',
    RETRIEVE: '/compute_plan/__KEY__/',
    CANCEL: '/compute_plan/__KEY__/cancel/',
    LIST_TUPLES: '/compute_plan/__KEY__/task/',
    LIST_PERFORMANCES: '/compute_plan/__KEY__/perf/',
    EXPORT_PERFORMANCES: '/performance/export/',
};

type ListComputePlansArgsProps = APIListArgsT & {
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

type APIListCPTuplesArgsProps = APIListArgsT & {
    key: string;
};

export const listComputePlanTuples = (
    { key, ...apiListArgs }: APIListCPTuplesArgsProps,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<TupleT>> => {
    return API.authenticatedGet(URLS.LIST_TUPLES.replace('__KEY__', key), {
        ...getApiOptions(apiListArgs),
        ...config,
    });
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
    apiListArgs: APIListArgsT,
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
