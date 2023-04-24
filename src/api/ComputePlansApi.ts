import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/api/request';
import { API_PATHS, compilePath } from '@/paths';
import {
    APIListArgsT,
    APIRetrieveListArgsT,
    PaginatedApiResponseT,
} from '@/types/CommonTypes';
import { ComputePlanStubT, ComputePlanT } from '@/types/ComputePlansTypes';
import {
    ComputePlanStatisticsT,
    PerformanceT,
} from '@/types/PerformancesTypes';
import { TaskT } from '@/types/TasksTypes';

export const listComputePlans = (
    apiListArgs: APIListArgsT,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<ComputePlanStubT>> =>
    API.authenticatedGet(API_PATHS.COMPUTE_PLANS, {
        ...getApiOptions(apiListArgs),
        ...config,
    });

export const retrieveComputePlan = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<ComputePlanT> =>
    API.authenticatedGet(compilePath(API_PATHS.COMPUTE_PLAN, { key }), config);

export const cancelComputePlan = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<ComputePlanT> =>
    API.post(compilePath(API_PATHS.COMPUTE_PLAN_CANCEL, { key }), config);

export const listComputePlanTasks = (
    { key, ...apiListArgs }: APIRetrieveListArgsT,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<TaskT>> => {
    return API.authenticatedGet(
        compilePath(API_PATHS.COMPUTE_PLAN_TASKS, { key }),
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
    { key, ...apiListArgs }: APIRetrieveListArgsT,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedPerformanceResponseT> => {
    return API.authenticatedGet(
        compilePath(API_PATHS.COMPUTE_PLAN_PERFORMANCES, { key }),
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
    return API.authenticatedGet(API_PATHS.PERFORMANCES_EXPORT, {
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
    API.put(compilePath(API_PATHS.COMPUTE_PLAN, { key }), computePlan, config);
