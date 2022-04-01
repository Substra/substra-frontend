import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/libs/request';
import {
    APIListArgs,
    PaginatedApiResponse,
} from '@/modules/common/CommonTypes';

import {
    TraintupleStub,
    CompositeTraintupleStub,
    Aggregatetuple,
    TesttupleStub,
    CompositeTraintuple,
    Testtuple,
    Traintuple,
    AggregatetupleStub,
} from './TuplesTypes';

export const URLS = {
    AGGREGATE_LIST: '/aggregatetuple/',
    COMPOSITE_LIST: '/composite_traintuple/',
    TEST_LIST: '/testtuple/',
    TRAIN_LIST: '/traintuple/',

    AGGREGATE_RETRIEVE: '/aggregatetuple/__KEY__/',
    COMPOSITE_RETRIEVE: '/composite_traintuple/__KEY__/',
    TEST_RETRIEVE: '/testtuple/__KEY__/',
    TRAIN_RETRIEVE: '/traintuple/__KEY__/',

    LOGS_RETRIEVE: '/logs/__KEY__/file/',
};

export const listAggregatetuples = (
    apiListArgs: APIListArgs,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<AggregatetupleStub>> => {
    return API.authenticatedGet(URLS.AGGREGATE_LIST, {
        ...getApiOptions(apiListArgs),
        ...config,
    });
};

export const listCompositeTraintuples = (
    apiListArgs: APIListArgs,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<CompositeTraintupleStub>> => {
    return API.authenticatedGet(URLS.COMPOSITE_LIST, {
        ...getApiOptions(apiListArgs),
        ...config,
    });
};

export const listTesttuples = (
    apiListArgs: APIListArgs,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<TesttupleStub>> => {
    return API.authenticatedGet(URLS.TEST_LIST, {
        ...getApiOptions(apiListArgs),
        ...config,
    });
};

export const listTraintuples = (
    apiListArgs: APIListArgs,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<TraintupleStub>> => {
    return API.authenticatedGet(URLS.TRAIN_LIST, {
        ...getApiOptions(apiListArgs),
        ...config,
    });
};

export const retrieveAggregateTuple = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<Aggregatetuple> =>
    API.authenticatedGet(
        URLS.AGGREGATE_RETRIEVE.replace('__KEY__', key),
        config
    );

export const retrieveCompositeTraintuple = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<CompositeTraintuple> =>
    API.authenticatedGet(
        URLS.COMPOSITE_RETRIEVE.replace('__KEY__', key),
        config
    );

export const retrieveTesttuple = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<Testtuple> =>
    API.authenticatedGet(URLS.TEST_RETRIEVE.replace('__KEY__', key), config);

export const retrieveTraintuple = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<Traintuple> =>
    API.authenticatedGet(URLS.TRAIN_RETRIEVE.replace('__KEY__', key), config);

export const retrieveLogs = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<string> =>
    API.authenticatedGet(URLS.LOGS_RETRIEVE.replace('__KEY__', key), config);
