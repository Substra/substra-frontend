import { AxiosPromise, AxiosRequestConfig } from 'axios';

import { API_PATHS, compilePath } from '@/paths';
import { FunctionProfilingT } from '@/types/FunctionsTypes';
import { TaskProfilingT } from '@/types/TasksTypes';

import API from './request';

export const retrieveTaskProfiling = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<TaskProfilingT> =>
    API.authenticatedGet(
        compilePath(API_PATHS.TASK_PROFILING, { key }),
        config
    );

export const retrieveFunctionProfiling = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<FunctionProfilingT> =>
    API.authenticatedGet(
        compilePath(API_PATHS.FUNCTION_PROFILING, { key }),
        config
    );
