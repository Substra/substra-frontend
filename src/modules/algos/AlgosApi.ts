import { AlgoT } from './AlgosTypes';
import { AxiosPromise } from 'axios';

import { PaginatedApiResponse } from '@/modules/common/CommonTypes';

import API, { getApiOptions } from '@/libs/request';
import { SearchFilterType } from '@/libs/searchFilter';

const URLS = {
    LIST_AGGREGATE: '/aggregate_algo/',
    RETRIEVE_AGGREGATE: '/aggregate_algo/__KEY__/',

    LIST_STANDARD: '/algo/',
    RETRIEVE_STANDARD: '/algo/__KEY__/',

    LIST_COMPOSITE: '/composite_algo/',
    RETRIEVE_COMPOSITE: '/composite_algo/__KEY__/',
};

export const listAggregateAlgos = (
    searchFilters: SearchFilterType[],
    page?: number
): AxiosPromise<PaginatedApiResponse<AlgoT>> =>
    API.get(URLS.LIST_AGGREGATE, getApiOptions(searchFilters, page));

export const retrieveAggregateAlgo = (key: string): AxiosPromise<AlgoT> =>
    API.get(URLS.RETRIEVE_AGGREGATE.replace('__KEY__', key));

export const listStandardAlgos = (
    searchFilters: SearchFilterType[],
    page?: number
): AxiosPromise<PaginatedApiResponse<AlgoT>> =>
    API.get(URLS.LIST_STANDARD, getApiOptions(searchFilters, page));

export const retrieveStandardAlgo = (key: string): AxiosPromise<AlgoT> =>
    API.get(URLS.RETRIEVE_STANDARD.replace('__KEY__', key));

export const listCompositeAlgos = (
    searchFilters: SearchFilterType[],
    page?: number
): AxiosPromise<PaginatedApiResponse<AlgoT>> =>
    API.get(URLS.LIST_COMPOSITE, getApiOptions(searchFilters, page));

export const retrieveCompositeAlgo = (key: string): AxiosPromise<AlgoT> =>
    API.get(URLS.RETRIEVE_COMPOSITE.replace('__KEY__', key));

export default {
    listAggregateAlgos,
    retrieveAggregateAlgo,
    listStandardAlgos,
    retrieveStandardAlgo,
    listCompositeAlgos,
    retrieveCompositeAlgo,
};
