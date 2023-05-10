import { AxiosResponse } from 'axios';

import { RawBearerTokenT, RawNewBearerTokenT } from '@/types/BearerTokenTypes';

import API from './request';

const URLS = {
    API_TOKEN: `/api-token/`,
    ACTIVE_API_TOKENS: `/active-api-tokens/`,
};

export const requestToken = (
    note: string,
    expires_at: string | null
): Promise<AxiosResponse<RawNewBearerTokenT>> => {
    return API.post(URLS.API_TOKEN, { expires_at: expires_at, note: note });
};

export const listActiveTokens = (): Promise<
    AxiosResponse<{ tokens: RawBearerTokenT[] }>
> => {
    return API.authenticatedGet(URLS.ACTIVE_API_TOKENS);
};

export const deleteToken = (id: string): Promise<never> => {
    return API.delete(URLS.ACTIVE_API_TOKENS.concat(`?id=`).concat(id));
};
