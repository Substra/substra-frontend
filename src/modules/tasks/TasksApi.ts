import API, { getApiOptions } from '@/libs/request';
import { SearchFilterType } from '@/libs/searchFilter';
import { AxiosPromise } from 'axios';
import {
    AggregateTaskType,
    CompositeTrainTaskType,
    TestTaskType,
    TrainTaskType,
} from './TasksTypes';

const URLS = {
    AGGREGATE_LIST: '/aggregatetuple/',
    COMPOSITE_LIST: '/composite_traintuple/',
    TEST_LIST: '/testtuple/',
    TRAIN_LIST: '/traintuple/',
};

export const listAggregateTasks = (
    searchFilters: SearchFilterType[]
): AxiosPromise<AggregateTaskType[]> => {
    return API.get(URLS.AGGREGATE_LIST, getApiOptions(searchFilters));
};

export const listCompositeTasks = (
    searchFilters: SearchFilterType[]
): AxiosPromise<CompositeTrainTaskType[]> => {
    return API.get(URLS.COMPOSITE_LIST, getApiOptions(searchFilters));
};

export const listTestTasks = (
    searchFilters: SearchFilterType[]
): AxiosPromise<TestTaskType[]> => {
    return API.get(URLS.TEST_LIST, getApiOptions(searchFilters));
};

export const listTrainTasks = (
    searchFilters: SearchFilterType[]
): AxiosPromise<TrainTaskType[]> => {
    return API.get(URLS.TRAIN_LIST, getApiOptions(searchFilters));
};

export default {
    listAggregateTasks,
    listCompositeTasks,
    listTestTasks,
    listTrainTasks,
};
