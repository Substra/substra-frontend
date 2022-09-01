import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/libs/request';
import {
    APIListArgsT,
    PaginatedApiResponseT,
} from '@/modules/common/CommonTypes';

import {
    TraintupleStubT,
    CompositeTraintupleStubT,
    AggregatetupleT,
    TesttupleStubT,
    CompositeTraintupleT,
    TesttupleT,
    TraintupleT,
    AggregatetupleStubT,
    PredicttupleStubT,
    PredicttupleT,
} from './TuplesTypes';

export const URLS = {
    AGGREGATE_LIST: '/aggregatetuple/',
    COMPOSITE_LIST: '/composite_traintuple/',
    TEST_LIST: '/testtuple/',
    TRAIN_LIST: '/traintuple/',
    PREDICT_LIST: '/predicttuple/',

    AGGREGATE_RETRIEVE: '/aggregatetuple/__KEY__/',
    COMPOSITE_RETRIEVE: '/composite_traintuple/__KEY__/',
    TEST_RETRIEVE: '/testtuple/__KEY__/',
    TRAIN_RETRIEVE: '/traintuple/__KEY__/',
    PREDICT_RETRIEVE: '/predicttuple/__KEY__/',

    LOGS_RETRIEVE: '/logs/__KEY__/file/',
};

export const listAggregatetuples = (
    apiListArgs: APIListArgsT,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<AggregatetupleStubT>> => {
    return API.authenticatedGet(URLS.AGGREGATE_LIST, {
        ...getApiOptions(apiListArgs),
        ...config,
    });
};

export const listCompositeTraintuples = (
    apiListArgs: APIListArgsT,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<CompositeTraintupleStubT>> => {
    return API.authenticatedGet(URLS.COMPOSITE_LIST, {
        ...getApiOptions(apiListArgs),
        ...config,
    });
};

export const listTesttuples = (
    apiListArgs: APIListArgsT,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<TesttupleStubT>> => {
    return API.authenticatedGet(URLS.TEST_LIST, {
        ...getApiOptions(apiListArgs),
        ...config,
    });
};

export const listTraintuples = (
    apiListArgs: APIListArgsT,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<TraintupleStubT>> => {
    return API.authenticatedGet(URLS.TRAIN_LIST, {
        ...getApiOptions(apiListArgs),
        ...config,
    });
};

export const listPredicttuples = (
    apiListArgs: APIListArgsT,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<PredicttupleStubT>> => {
    return API.authenticatedGet(URLS.PREDICT_LIST, {
        ...getApiOptions(apiListArgs),
        ...config,
    });
};

export const retrieveAggregateTuple = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<AggregatetupleT> =>
    API.authenticatedGet(
        URLS.AGGREGATE_RETRIEVE.replace('__KEY__', key),
        config
    );

export const retrieveCompositeTraintuple = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<CompositeTraintupleT> =>
    API.authenticatedGet(
        URLS.COMPOSITE_RETRIEVE.replace('__KEY__', key),
        config
    );

export const retrieveTesttuple = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<TesttupleT> =>
    API.authenticatedGet(URLS.TEST_RETRIEVE.replace('__KEY__', key), config);

export const retrieveTraintuple = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<TraintupleT> =>
    API.authenticatedGet(URLS.TRAIN_RETRIEVE.replace('__KEY__', key), config);

export const retrievePredicttuple = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<PredicttupleT> =>
    API.authenticatedGet(URLS.PREDICT_RETRIEVE.replace('__KEY__', key), config);

export const retrieveLogs = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<string> =>
    API.authenticatedGet(URLS.LOGS_RETRIEVE.replace('__KEY__', key), config);
