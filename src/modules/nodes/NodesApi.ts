import { NodeInfoType, NodeType } from './NodesTypes';
import { AxiosPromise } from 'axios';

import API from '@/libs/request';

const URLS = {
    LIST: '/node/',
    INFO: '/info/',
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
