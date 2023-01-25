import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API from '@/api/request';
import { API_PATHS, compilePath } from '@/paths';
import { TaskGraphT } from '@/types/CPWorkflowTypes';

export const retrieveCPWorkflowGraph = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<TaskGraphT> =>
    API.authenticatedGet(compilePath(API_PATHS.WORKFLOW, { key }), config);
