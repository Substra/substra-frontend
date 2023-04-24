import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/api/request';
import { API_PATHS, compilePath } from '@/paths';
import { APIListArgsT, PaginatedApiResponseT } from '@/types/CommonTypes';
import { FunctionT } from '@/types/FunctionsTypes';

export const listFunctions = (
    apiListArgs: APIListArgsT,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<FunctionT>> =>
    API.authenticatedGet(API_PATHS.FUNCTIONS, {
        ...getApiOptions(apiListArgs),
        ...config,
    });

export const retrieveFunction = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<FunctionT> =>
    API.authenticatedGet(compilePath(API_PATHS.FUNCTION, { key }), config);

export const updateFunction = (
    key: string,
    func: { name: string },
    config: AxiosRequestConfig
): AxiosPromise<FunctionT> =>
    API.put(compilePath(API_PATHS.FUNCTION, { key }), func, config);
