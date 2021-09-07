import { AxiosPromise } from 'axios';

import API from '@/libs/request';

export const retrieveDescription = (url: string): AxiosPromise<string> =>
    API.authenticatedGet(url);

export default {
    retrieveDescription,
};
