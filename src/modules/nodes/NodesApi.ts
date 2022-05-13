import { AxiosPromise } from 'axios';

import API from '@/libs/request';

import { NodeInfoType, NodeType } from './NodesTypes';

const URLS = {
    LIST: '/node/',
    INFO: '/info/',
    METADATA: '/compute_plan_metadata/',
};

export const listNodes = (): AxiosPromise<NodeType[]> =>
    API.authenticatedGet(URLS.LIST);

export const retrieveInfo = (
    withCredentials: boolean
): AxiosPromise<NodeInfoType> => {
    if (withCredentials) {
        return API.authenticatedGet(URLS.INFO);
    }

    return API.anonymousGet(URLS.INFO);
};

export const listMetadata = (): AxiosPromise<string[]> =>
    API.authenticatedGet(URLS.METADATA);
