import { AxiosResponse } from 'axios';

import API from '@/libs/request';

import { RawBearerTokenT, RawNewBearerTokenT } from './BearerTokenTypes';

const URLS = {
    API_TOKEN: `/api-token`,
    ACTIVE_API_TOKENS: `/active-api-tokens`,
};

export const requestToken = (): Promise<AxiosResponse<RawNewBearerTokenT>> => {
    return API.authenticatedGet(URLS.API_TOKEN);
};

export const listActiveTokens = (): Promise<
    AxiosResponse<{ tokens: RawBearerTokenT[] }>
> => {
    return API.authenticatedGet(URLS.ACTIVE_API_TOKENS);
};
