import axios, {
    AxiosError,
    AxiosInstance,
    AxiosPromise,
    AxiosRequestConfig,
    AxiosRequestHeaders,
} from 'axios';
import Cookies from 'universal-cookie';

import { AbortFunctionT, PaginatedApiResponseT } from '@/types/CommonTypes';

const CONFIG = {
    baseURL: API_URL,
    timeout: 2 * 60 * 1000, // 2 mins
    headers: {
        Accept: 'application/json;version=0.0',
        'Content-Type': 'application/json;',
    },
};

const instance = axios.create({ ...CONFIG });

instance.interceptors.request.use((config) => {
    const cookies = new Cookies();
    const jwt = cookies.get('header.payload');
    const headers: AxiosRequestHeaders = {};

    if (jwt) {
        headers['Authorization'] = `JWT ${jwt}`;
    }

    return {
        ...config,
        withCredentials: true,
        headers,
    };
});

const withRetry =
    (instanceMethod: AxiosInstance['get']) =>
    (url: string, config?: AxiosRequestConfig) => {
        return instanceMethod(url, config).catch((error) => {
            if (error.response && error.response.status === 401) {
                return instance.post('/me/refresh/').then(
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
    put: instance.put,
    delete: instance.delete,
    anonymousGet: anonymousInstance.get,
};

export const getApiOptions = ({
    page,
    pageSize,
    ...otherParams
}: {
    page?: number;
    pageSize?: number;
    [param: string]: unknown;
}): AxiosRequestConfig => {
    let params = {};

    // pagination
    if (page) {
        params = {
            ...params,
            page_size: pageSize ?? DEFAULT_PAGE_SIZE,
            page,
        };
    }

    // send arrays as csv
    for (const param in otherParams) {
        if (!Array.isArray(otherParams[param])) {
            continue;
        }

        const paramArray = otherParams[param] as Array<unknown>;
        otherParams[param] = paramArray.join(',');
    }

    // remove empty values
    const keys = Object.keys(otherParams);
    for (const key of keys) {
        const value = otherParams[key];
        if (value === undefined || value === null || value === '') {
            delete otherParams[key];
        }
    }

    const options = {
        params: {
            ...params,
            ...otherParams,
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

export const getAllPages = async <T>(
    getPage: (page: number) => AxiosPromise<PaginatedApiResponseT<T>>,
    pageSize: number
): Promise<T[]> => {
    let res: T[] = [];
    let page = 1;
    let lastPage = 1;
    while (page <= lastPage) {
        const response = await getPage(page);
        res = [...res, ...response.data.results];
        lastPage = Math.ceil(response.data.count / pageSize);
        page += 1;
    }
    return res;
};

export const handleUnknownError = (error: unknown): string => {
    console.warn(error);
    if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status && status >= 400 && status < 500) {
            const data = error.response?.data;
            let msg;
            if (typeof data === 'object' && data.detail) {
                msg = data.detail;
            } else {
                msg = JSON.stringify(data);
            }
            return msg;
        }
    }
    return 'Unknown error';
};

// Used to create an abort controller for a given function
// Returns a function launching abort to cancel the call of the func given as parameters when no longer needed
// namely when making the same call twice (= reloading) or when unmounting useEffect (= changing page in app)
// Cancelling unfinished calls that are no longer needed is for performance gains
export const withAbortSignal =
    <ParamsT extends unknown[]>(
        func: (signal: AbortSignal, ...params: ParamsT) => void
    ) =>
    (...params: ParamsT): AbortFunctionT => {
        const controller = new AbortController();
        func(controller.signal, ...params);
        return () => controller.abort();
    };
