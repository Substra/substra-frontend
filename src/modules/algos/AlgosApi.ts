import { APIAlgoType } from './AlgosTypes';
import { AxiosPromise } from 'axios';

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
    searchFilters: SearchFilterType[]
): AxiosPromise<APIAlgoType[]> =>
    API.get(URLS.LIST_AGGREGATE, getApiOptions(searchFilters));

export const retrieveAggregateAlgo = (key: string): AxiosPromise<APIAlgoType> =>
    API.get(URLS.RETRIEVE_AGGREGATE.replace('__KEY__', key));

export const listStandardAlgos = (
    searchFilters: SearchFilterType[]
): AxiosPromise<APIAlgoType[]> =>
    API.get(URLS.LIST_STANDARD, getApiOptions(searchFilters));

export const retrieveStandardAlgo = (key: string): AxiosPromise<APIAlgoType> =>
    API.get(URLS.RETRIEVE_STANDARD.replace('__KEY__', key));

export const listCompositeAlgos = (
    searchFilters: SearchFilterType[]
): AxiosPromise<APIAlgoType[]> =>
    API.get(URLS.LIST_COMPOSITE, getApiOptions(searchFilters));

export const retrieveCompositeAlgo = (key: string): AxiosPromise<APIAlgoType> =>
    API.get(URLS.RETRIEVE_COMPOSITE.replace('__KEY__', key));

export default {
    listAggregateAlgos,
    retrieveAggregateAlgo,
    listStandardAlgos,
    retrieveStandardAlgo,
    listCompositeAlgos,
    retrieveCompositeAlgo,
};
