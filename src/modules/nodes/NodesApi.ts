import { NodeInfoType, NodeType } from './NodesTypes';
import { AxiosPromise } from 'axios';

import API from '@/libs/request';

const URLS = {
    LIST: '/node/',
    INFO: '/info/',
};

export const listNodes = (): AxiosPromise<NodeType[]> => API.get(URLS.LIST);

export const retrieveInfo = (): AxiosPromise<NodeInfoType> =>
    API.get(URLS.INFO);

export default {
    listNodes,
    retrieveInfo,
};
