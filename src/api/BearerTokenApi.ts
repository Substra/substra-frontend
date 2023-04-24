import { AxiosResponse } from 'axios';

import { RawBearerTokenT, RawNewBearerTokenT } from '@/types/BearerTokenTypes';

import API from './request';

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
