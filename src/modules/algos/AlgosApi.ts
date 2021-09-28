import { AlgoT } from './AlgosTypes';
import { AxiosPromise } from 'axios';

import { PaginatedApiResponse } from '@/modules/common/CommonTypes';

import API, { getApiOptions } from '@/libs/request';
import { SearchFilterType } from '@/libs/searchFilter';

const URLS = {
    LIST: '/algo/',
    RETRIEVE: '/algo/__KEY__/',
};

export const listAlgos = (
    searchFilters: SearchFilterType[],
    page?: number
): AxiosPromise<PaginatedApiResponse<AlgoT>> =>
    API.authenticatedGet(URLS.LIST, getApiOptions(searchFilters, page));

export const retrieveAlgo = (key: string): AxiosPromise<AlgoT> =>
    API.authenticatedGet(URLS.RETRIEVE.replace('__KEY__', key));

export default {
    listAlgos,
    retrieveAlgo,
};
