import API, { getApiOptions } from '@/libs/request';
import { SearchFilterType } from '@/libs/searchFilter';
import { AxiosPromise } from 'axios';
import {
    TraintupleT,
    CompositeTraintupleT,
    AggregatetupleT,
    TesttupleT,
} from './TuplesTypes';

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
    searchFilters: SearchFilterType[]
): AxiosPromise<AggregatetupleT[]> => {
    return API.get(URLS.AGGREGATE_LIST, getApiOptions(searchFilters));
};

export const listCompositeTraintuples = (
    searchFilters: SearchFilterType[]
): AxiosPromise<CompositeTraintupleT[]> => {
    return API.get(URLS.COMPOSITE_LIST, getApiOptions(searchFilters));
};

export const listTesttuples = (
    searchFilters: SearchFilterType[]
): AxiosPromise<TesttupleT[]> => {
    return API.get(URLS.TEST_LIST, getApiOptions(searchFilters));
};

export const listTraintuples = (
    searchFilters: SearchFilterType[]
): AxiosPromise<TraintupleT[]> => {
    return API.get(URLS.TRAIN_LIST, getApiOptions(searchFilters));
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
