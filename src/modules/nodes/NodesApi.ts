import { NodeType } from './NodesTypes';
import { AxiosPromise } from 'axios';

import API from '@/libs/request';

const URLS = {
    LIST: '/node/',
};

export const listNodes = (): AxiosPromise<NodeType[]> => API.get(URLS.LIST);

export default {
    listNodes,
};
