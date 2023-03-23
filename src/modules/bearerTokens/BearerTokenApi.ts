import { AxiosPromise } from 'axios';

import API from '@/libs/request';

import { NewBearerTokenT, BunchOfBearerTokensT } from './BearerTokenTypes';

const API_TOKEN_URL = `/api-token`;
const API_ACTIVE_TOKENS_URL = `/active-api-tokens`;

export const requestToken = (): AxiosPromise<NewBearerTokenT> => {
    return API.authenticatedGet(API_TOKEN_URL);
};

export const listActiveTokens = (): AxiosPromise<BunchOfBearerTokensT> => {
    return API.authenticatedGet(API_ACTIVE_TOKENS_URL);
};
