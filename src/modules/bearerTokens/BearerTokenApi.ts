import API from '@/libs/request';

import {
    BearerTokenT,
    NewBearerTokenT,
    RawBearerTokenT,
    RawNewBearerTokenT,
} from './BearerTokenTypes';

const API_TOKEN_URL = `/api-token`;
const API_ACTIVE_TOKENS_URL = `/active-api-tokens`;

const parseToken = (object: RawBearerTokenT): BearerTokenT => {
    return {
        created_at: new Date(object.created_at),
        expires_at: new Date(object.expires_at),
    };
};

const parseNewToken = (object: RawNewBearerTokenT): NewBearerTokenT => {
    return {
        token: object.token,
        created_at: new Date(object.created_at),
        expires_at: new Date(object.expires_at),
    };
};

export const requestToken = () => {
    return API.authenticatedGet(API_TOKEN_URL).then((response) => {
        return parseNewToken(response.data);
    });
};

export const listActiveTokens = () => {
    return API.authenticatedGet(API_ACTIVE_TOKENS_URL).then((response) => {
        return (response.data.tokens as RawBearerTokenT[]).map(parseToken);
    });
};
