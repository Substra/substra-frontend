import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/libs/request';
import {
    APIListArgsT,
    PaginatedApiResponseT,
} from '@/modules/common/CommonTypes';

import { TaskT } from './TasksTypes';

export const URLS = {
    LIST: '/task/',
    RETRIEVE: 'task/__KEY__',
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

export const retrieveLogs = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<string> =>
    API.authenticatedGet(URLS.LOGS_RETRIEVE.replace('__KEY__', key), config);
