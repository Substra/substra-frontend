import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import qs from 'qs';
import Cookies from 'universal-cookie';

import {
    buildSearchFiltersString,
    SearchFilterType,
} from '@/libs/searchFilter';

const CONFIG = {
    baseURL: API_URL,
    timeout: 2 * 60 * 1000, // 2 mins
    headers: {
        Accept: 'application/json;version=0.0',
        'Content-Type': 'application/json;',
    },
};

const NONENUMFILTERS = ['owner__in', 'worker__in', 'key__in'];

const instance = axios.create({ ...CONFIG });

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

const withRetry =
    (instanceMethod: AxiosInstance['get']) =>
    (url: string, config?: AxiosRequestConfig) => {
        return instanceMethod(url, config).catch((error) => {
            if (error.response && error.response.status === 401) {
                return instance.post('/user/refresh/').then(
                    () => instanceMethod(url, config),
                    () => {
                        if (!window.location.pathname.startsWith('/login')) {
                            const url = encodeURI(
                                `/login?logout=true&next=${window.location.pathname}${window.location.search}`
                            );
                            history.pushState({}, '', url);
                        }
                        throw error;
                    }
                );
            }
            throw error;
        });
    };

const anonymousInstance = axios.create({ ...CONFIG, withCredentials: false });

const API = {
    authenticatedGet: withRetry(instance.get),
    get: instance.get,
    post: instance.post,
    anonymousGet: anonymousInstance.get,
};

export const getApiOptions = ({
    searchFilters,
    page,
    pageSize,
    ...otherParams
}: {
    searchFilters?: SearchFilterType[];
    page?: number;
    pageSize?: number;
    [param: string]: unknown;
}): AxiosRequestConfig => {
    let params = {};

    // searchFilters
    if (searchFilters) {
        const search = buildSearchFiltersString(searchFilters);
        if (search) {
            params = { ...params, search };
        }
    }

    // pagination
    if (page) {
        params = {
            ...params,
            page_size: pageSize || DEFAULT_PAGE_SIZE,
            page,
        };
    }

    /** Non-enum filters
    /* Needs a special handling as the backend is waiting for a format of type: "filter=filter1, filter2" 
    /* Contrary to enum filters which have format: "filter=filter1&filter=filter2"
    **/
    for (const param in otherParams) {
        if (!Array.isArray(otherParams[param])) {
            continue;
        }

        const paramArray = otherParams[param] as Array<unknown>;
        if (NONENUMFILTERS.includes(param) && paramArray.length > 1) {
            otherParams[param] = paramArray.join(',');
        }
    }

    const options = {
        params: {
            ...params,
            ...otherParams,
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        paramsSerializer: (params: any): string => {
            return qs.stringify(params, {
                arrayFormat: 'repeat',
            });
        },
    };
    return options;
};

export const downloadBlob = (blob: Blob, filename: string): void => {
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
