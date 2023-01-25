import { AxiosPromise } from 'axios';

import API from '@/api/request';
import { API_PATHS } from '@/paths';

export const listMetadata = (): AxiosPromise<string[]> =>
    API.authenticatedGet(API_PATHS.METADATA);
