import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/api/request';
import { API_PATHS, compilePath } from '@/paths';
import { APIListArgsT, PaginatedApiResponseT } from '@/types/CommonTypes';
import { TaskT, TaskIOT, TaskProfilingT } from '@/types/TasksTypes';

export const listTasks = (
    apiListArgs: APIListArgsT,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<TaskT>> =>
    API.authenticatedGet(API_PATHS.TASKS, {
        ...getApiOptions(apiListArgs),
        ...config,
    });

export const retrieveTask = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<TaskT> =>
    API.authenticatedGet(compilePath(API_PATHS.TASK, { key }), config);

export const listTaskInputAssets = (
    key: string,
    apiListArgs: APIListArgsT,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<TaskIOT>> =>
    API.authenticatedGet(compilePath(API_PATHS.TASK_INPUTS, { key }), {
        ...getApiOptions(apiListArgs),
        ...config,
    });

export const listTaskOutputAssets = (
    key: string,
    apiListArgs: APIListArgsT,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<TaskIOT>> =>
    API.authenticatedGet(compilePath(API_PATHS.TASK_OUTPUTS, { key }), {
        ...getApiOptions(apiListArgs),
        ...config,
    });

export const retrieveLogs = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<string> =>
    API.authenticatedGet(compilePath(API_PATHS.LOGS, { key }), config);

export const retrieveTaskProfiling = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<TaskProfilingT> =>
    API.authenticatedGet(
        compilePath(API_PATHS.TASK_PROFILING, { key }),
        config
    );
