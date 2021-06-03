import API from '@/libs/request';
import { AxiosPromise } from 'axios';

import { ComputePlanType } from './ComputePlansTypes';

const URLS = {
    LIST: '/compute_plan/',
    RETRIEVE: '/compute_plan/__KEY__',
};

export const listComputePlans = (): AxiosPromise<ComputePlanType[]> =>
    API.get(URLS.LIST);

export const getComputePlan = (key: string): AxiosPromise<ComputePlanType> =>
    API.get(URLS.RETRIEVE.replace('__KEY__', key));

export default {
    listComputePlans,
    getComputePlan,
};
