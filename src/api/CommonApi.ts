import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API from '@/api/request';

export const retrieveDescription = (
    url: string,
    config: AxiosRequestConfig
): AxiosPromise<string> => API.authenticatedGet(url, config);
