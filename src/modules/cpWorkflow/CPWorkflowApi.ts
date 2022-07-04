import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API from '@/libs/request';

import { TaskGraphT } from './CPWorkflowTypes';

const URLS = {
    RETRIEVE: '/compute_plan/__KEY__/workflow_graph/',
};

export const retrieveCPWorkflowGraph = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<TaskGraphT> =>
    API.authenticatedGet(URLS.RETRIEVE.replace('__KEY__', key), config);
