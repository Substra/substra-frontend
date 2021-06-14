import API, { getApiOptions } from '@/libs/request';
import { SearchFilterType } from '@/libs/searchFilter';
import { AxiosPromise } from 'axios';
import {
    AggregateTupleType,
    CompositeTrainTupleType,
    TestTupleType,
    TrainTupleType,
} from './TuplesTypes';

const URLS = {
    AGGREGATE_LIST: '/aggregatetuple/',
    COMPOSITE_LIST: '/composite_traintuple/',
    TEST_LIST: '/testtuple/',
    TRAIN_LIST: '/traintuple/',
};

export const listAggregateTuples = (
    searchFilters: SearchFilterType[]
): AxiosPromise<AggregateTupleType[]> => {
    return API.get(URLS.AGGREGATE_LIST, getApiOptions(searchFilters));
};

export const listCompositeTuples = (
    searchFilters: SearchFilterType[]
): AxiosPromise<CompositeTrainTupleType[]> => {
    return API.get(URLS.COMPOSITE_LIST, getApiOptions(searchFilters));
};

export const listTestTuples = (
    searchFilters: SearchFilterType[]
): AxiosPromise<TestTupleType[]> => {
    return API.get(URLS.TEST_LIST, getApiOptions(searchFilters));
};

export const listTrainTuples = (
    searchFilters: SearchFilterType[]
): AxiosPromise<TrainTupleType[]> => {
    return API.get(URLS.TRAIN_LIST, getApiOptions(searchFilters));
};

export default {
    listAggregateTuples,
    listCompositeTuples,
    listTestTuples,
    listTrainTuples,
};
