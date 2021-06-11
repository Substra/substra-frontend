import API from '@/libs/request';
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
    computePlanKey?: string
): AxiosPromise<AggregateTupleType[]> => {
    let formattedStringRequest = '';
    if (computePlanKey) {
        formattedStringRequest = `?search=aggregatetuple:compute_plan_key:${computePlanKey}`;
    }
    return API.get(`${URLS.AGGREGATE_LIST}${formattedStringRequest}`);
};

export const listCompositeTuples = (
    computePlanKey?: string
): AxiosPromise<CompositeTrainTupleType[]> => {
    let formattedStringRequest = '';
    if (computePlanKey) {
        formattedStringRequest = `?search=composite_traintuple:compute_plan_key:${computePlanKey}`;
    }
    return API.get(`${URLS.COMPOSITE_LIST}${formattedStringRequest}`);
};

export const listTestTuples = (
    computePlanKey?: string
): AxiosPromise<TestTupleType[]> => {
    let formattedStringRequest = '';
    if (computePlanKey) {
        formattedStringRequest = `?search=testtuple:compute_plan_key:${computePlanKey}`;
    }
    return API.get(`${URLS.TEST_LIST}${formattedStringRequest}`);
};

export const listTrainTuples = (
    computePlanKey?: string
): AxiosPromise<TrainTupleType[]> => {
    let formattedStringRequest = '';
    if (computePlanKey) {
        formattedStringRequest = `?search=traintuple:compute_plan_key:${computePlanKey}`;
    }
    return API.get(`${URLS.TRAIN_LIST}${formattedStringRequest}`);
};

export default {
    listAggregateTuples,
    listCompositeTuples,
    listTestTuples,
    listTrainTuples,
};
