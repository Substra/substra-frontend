import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'universal-cookie';

import {
    buildSearchFiltersString,
    SearchFilterType,
} from '@/libs/searchFilter';

const API = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
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

export default API;
