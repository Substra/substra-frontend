import { AxiosPromise } from 'axios';

import API from '@/libs/request';

import { RawBearerTokenT, BearerTokenT } from './BearerTokenTypes';

const API_TOKEN_URL = `/api-token-tap`;

export const retrieveToken = (): AxiosPromise<RawBearerTokenT> => {
    return API.authenticatedGet(API_TOKEN_URL);
};
