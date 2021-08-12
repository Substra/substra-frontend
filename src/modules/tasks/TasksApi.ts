import { PaginatedApiResponse } from '../common/CommonTypes';
import {
    TraintupleT,
    CompositeTraintupleT,
    AggregatetupleT,
    TesttupleT,
} from './TuplesTypes';
import { AxiosPromise } from 'axios';

import API, { getApiOptions } from '@/libs/request';
import { SearchFilterType } from '@/libs/searchFilter';

const URLS = {
    AGGREGATE_LIST: '/aggregatetuple/',
    COMPOSITE_LIST: '/composite_traintuple/',
    TEST_LIST: '/testtuple/',
    TRAIN_LIST: '/traintuple/',

    AGGREGATE_RETRIEVE: '/aggregatetuple/__KEY__/',
    COMPOSITE_RETRIEVE: '/composite_traintuple/__KEY__/',
    TEST_RETRIEVE: '/testtuple/__KEY__/',
    TRAIN_RETRIEVE: '/traintuple/__KEY__/',
};

export const listAggregatetuples = (
    searchFilters: SearchFilterType[],
    page?: number
): AxiosPromise<PaginatedApiResponse<AggregatetupleT>> => {
    return API.get(URLS.AGGREGATE_LIST, getApiOptions(searchFilters, page));
};

export const listCompositeTraintuples = (
    searchFilters: SearchFilterType[],
    page?: number
): AxiosPromise<PaginatedApiResponse<CompositeTraintupleT>> => {
    return API.get(URLS.COMPOSITE_LIST, getApiOptions(searchFilters, page));
};

export const listTesttuples = (
    searchFilters: SearchFilterType[],
    page?: number
): AxiosPromise<PaginatedApiResponse<TesttupleT>> => {
    return API.get(URLS.TEST_LIST, getApiOptions(searchFilters, page));
};

export const listTraintuples = (
    searchFilters: SearchFilterType[],
    page?: number
): AxiosPromise<PaginatedApiResponse<TraintupleT>> => {
    return API.get(URLS.TRAIN_LIST, getApiOptions(searchFilters, page));
};

export const retrieveAggregateTuple = (
    key: string
): AxiosPromise<AggregatetupleT> =>
    API.get(URLS.AGGREGATE_RETRIEVE.replace('__KEY__', key));

export const retrieveCompositeTraintuple = (
    key: string
): AxiosPromise<CompositeTraintupleT> =>
    API.get(URLS.COMPOSITE_RETRIEVE.replace('__KEY__', key));

export const retrieveTesttuple = (key: string): AxiosPromise<TesttupleT> =>
    API.get(URLS.TEST_RETRIEVE.replace('__KEY__', key));

export const retrieveTraintuple = (key: string): AxiosPromise<TraintupleT> =>
    API.get(URLS.TRAIN_RETRIEVE.replace('__KEY__', key));

export default {
    listAggregatetuples,
    listCompositeTraintuples,
    listTesttuples,
    listTraintuples,

    retrieveAggregateTuple,
    retrieveCompositeTraintuple,
    retrieveTesttuple,
    retrieveTraintuple,
};
