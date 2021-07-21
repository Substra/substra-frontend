import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'universal-cookie';

import {
    buildSearchFiltersString,
    SearchFilterType,
} from '@/libs/searchFilter';

declare const API_URL: string;

const API = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        Accept: 'application/json;version=0.0',
        'Content-Type': 'application/json;',
    },
});

// TODO:
// proper request handling should be:
// 1. try call
// 2. if success, then success
// 3. if auth error, then refresh token, then try call again

API.interceptors.request.use((config) => {
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

export const getApiOptions = (
    searchFilters: SearchFilterType[]
): AxiosRequestConfig => {
    const search = buildSearchFiltersString(searchFilters);

    let options = {};
    if (search) {
        options = { params: { search } };
    }

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
    const response = await API.get(url, { responseType: 'blob' });
    downloadBlob(response.data, filename);
};
export default API;
