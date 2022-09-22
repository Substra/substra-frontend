import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import Cookies from 'universal-cookie';

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
