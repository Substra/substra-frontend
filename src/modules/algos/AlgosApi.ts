import API from '@/libs/request';
import { AxiosPromise } from 'axios';
import { APIAlgoType } from './AlgosTypes';

const URLS = {
    LIST_AGGREGATE: '/aggregate_algo/',
    RETRIEVE_AGGREGATE: '/aggregate_algo/__KEY__/',

    LIST_STANDARD: '/algo/',
    RETRIEVE_STANDARD: '/algo/__KEY__/',

    LIST_COMPOSITE: '/composite_algo/',
    RETRIEVE_COMPOSITE: '/composite_algo/__KEY__/',
};

export const listAggregateAlgos = (): AxiosPromise<APIAlgoType[]> =>
    API.get(URLS.LIST_AGGREGATE);

export const retrieveAggregateAlgo = (key: string): AxiosPromise<APIAlgoType> =>
    API.get(URLS.RETRIEVE_AGGREGATE.replace('__KEY__', key));

export const listStandardAlgos = (): AxiosPromise<APIAlgoType[]> =>
    API.get(URLS.LIST_STANDARD);

export const retrieveStandardAlgo = (key: string): AxiosPromise<APIAlgoType> =>
    API.get(URLS.RETRIEVE_STANDARD.replace('__KEY__', key));

export const listCompositeAlgos = (): AxiosPromise<APIAlgoType[]> =>
    API.get(URLS.LIST_COMPOSITE);

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
