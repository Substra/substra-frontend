import { AxiosPromise } from 'axios';

import API from '@/libs/request';

const URLS = {
    METADATA: '/compute_plan_metadata/',
};

export const listMetadata = (): AxiosPromise<string[]> =>
    API.authenticatedGet(URLS.METADATA);
