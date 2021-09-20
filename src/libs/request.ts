import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from 'axios';
import Cookies from 'universal-cookie';

import { PaginatedApiResponse } from '@/modules/common/CommonTypes';

import {
    buildSearchFiltersString,
    SearchFilterType,
} from '@/libs/searchFilter';

declare const API_URL: string;

const instance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        Accept: 'application/json;version=0.0',
        'Content-Type': 'application/json;',
    },
});

instance.interceptors.request.use((config) => {
    const cookies = new Cookies();
    const jwt = cookies.get('header.payload');
    return {
        ...config,
        withCredentials: true,
        headers: {
            Authorization: `JWT ${jwt}`,
        },
    };
});

const withRetry = (instanceMethod: AxiosInstance['get']) => (
    url: string,
    config?: AxiosRequestConfig
) => {
    return instanceMethod(url, config).catch((error) => {
        if (error.response && error.response.status === 401) {
            return instance.post('/user/refresh/').then(
                () => instanceMethod(url, config),
                () => {
                    const url = encodeURI(
                        `/login?logout=true&next=${window.location.pathname}${window.location.search}`
                    );
                    history.pushState({}, '', url);
                    throw error;
                }
            );
        }
        throw error;
    });
};

const API = {
    authenticatedGet: withRetry(instance.get),
    get: instance.get,
    post: instance.post,
};

declare const DEFAULT_PAGE_SIZE: number;

export const getApiOptions = (
    searchFilters: SearchFilterType[],
    page?: number,
    pageSize?: number
): AxiosRequestConfig => {
    let params = {};

    // searchFilters
    const search = buildSearchFiltersString(searchFilters);

    if (search) {
        params = { ...params, search };
    }

    // pagination
    if (page) {
        params = {
            ...params,
            page_size: pageSize || DEFAULT_PAGE_SIZE,
            page,
        };
    }

    const options = {
        params,
    };
    return options;
};

const downloadBlob = (blob: Blob, filename: string): void => {
    /**
     * Download method from
     * https://blog.logrocket.com/programmatic-file-downloads-in-the-browser-9a5186298d5c/
     */

    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';

    const clickHandler = () => {
        setTimeout(() => {
            URL.revokeObjectURL(url);
            a.removeEventListener('click', clickHandler);
        }, 150);
    };

    a.addEventListener('click', clickHandler, false);
    a.click();
};

export const downloadFromApi = async (
    url: string,
    filename: string
): Promise<void> => {
    const response = await API.authenticatedGet(url, { responseType: 'blob' });
    downloadBlob(response.data, filename);
};
export default API;

type ArgsWithPage<Args extends unknown[]> = [...Args, number, number?];

export const getAllPagesResults = async <Asset, CommonArgs extends unknown[]>(
    apiMethod: (
        ...args: ArgsWithPage<CommonArgs>
    ) => AxiosPromise<PaginatedApiResponse<Asset>>,
    commonApiMethodArgs: CommonArgs,
    pageSize: number
): Promise<Asset[]> => {
    const commonArgs = commonApiMethodArgs || [];
    const firstPage = await apiMethod(...commonArgs, 1, pageSize);
    const lastPage = Math.ceil(firstPage.data.count / pageSize);
    let results = firstPage.data.results;

    for (let page = 2; page <= lastPage; page++) {
        const currentPage = await apiMethod(...commonArgs, page, pageSize);
        results = [...results, ...currentPage.data.results];
    }
    return results;
};
