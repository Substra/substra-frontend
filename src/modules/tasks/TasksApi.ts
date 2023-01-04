import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/libs/request';
import {
    APIListArgsT,
    PaginatedApiResponseT,
} from '@/modules/common/CommonTypes';

import { TaskT, TaskIOT } from './TasksTypes';

export const URLS = {
    LIST: '/task/',
    RETRIEVE: 'task/__KEY__/',
    LIST_INPUTS: 'task/__KEY__/input_assets/',
    LIST_OUTPUTS: 'task/__KEY__/output_assets/',
    LOGS_RETRIEVE: '/logs/__KEY__/file/',
};

export const listTasks = (
    apiListArgs: APIListArgsT,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<TaskT>> =>
    API.authenticatedGet(URLS.LIST, {
        ...getApiOptions(apiListArgs),
        ...config,
    });

export const retrieveTask = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<TaskT> =>
    API.authenticatedGet(URLS.RETRIEVE.replace('__KEY__', key), config);

export const listTaskInputAssets = (
    key: string,
    apiListArgs: APIListArgsT,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<TaskIOT>> =>
    API.authenticatedGet(URLS.LIST_INPUTS.replace('__KEY__', key), {
        ...getApiOptions(apiListArgs),
        ...config,
    });

export const listTaskOutputAssets = (
    key: string,
    apiListArgs: APIListArgsT,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<TaskIOT>> =>
    API.authenticatedGet(URLS.LIST_OUTPUTS.replace('__KEY__', key), {
        ...getApiOptions(apiListArgs),
        ...config,
    });

export const retrieveLogs = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<string> =>
    API.authenticatedGet(URLS.LOGS_RETRIEVE.replace('__KEY__', key), config);
