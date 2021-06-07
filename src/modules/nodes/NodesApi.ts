import API from '@/libs/request';
import { AxiosPromise } from 'axios';

import { NodeType } from './NodesTypes';

const URLS = {
    LIST: '/node/',
};

export const listNodes = (): AxiosPromise<NodeType[]> => API.get(URLS.LIST);

export default {
    listNodes,
};
