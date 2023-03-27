import {
    listActiveTokens as listActiveTokensFromApi,
    requestToken as requestTokensFromApi,
} from './BearerTokenApi';
import {
    BearerTokenT,
    NewBearerTokenT,
    RawBearerTokenT,
    RawNewBearerTokenT,
} from './BearerTokenTypes';

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

export const requestToken = (): Promise<NewBearerTokenT> => {
    return requestTokensFromApi().then((response) => {
        return parseNewToken(response.data);
    });
};

export const listActiveTokens = (): Promise<BearerTokenT[]> => {
    return listActiveTokensFromApi().then((response) => {
        return (response.data.tokens as RawBearerTokenT[]).map(parseToken);
    });
};
