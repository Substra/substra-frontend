import {
    BearerTokenT,
    NewBearerTokenT,
    RawBearerTokenT,
    RawNewBearerTokenT,
} from './BearerTokenTypes';

export const parseToken = (object: RawBearerTokenT): BearerTokenT => {
    return {
        created_at: new Date(object.created_at),
        expires_at: new Date(object.expires_at),
    };
};

export const parseNewToken = (object: RawNewBearerTokenT): NewBearerTokenT => {
    return {
        token: object.token,
        created_at: new Date(object.created_at),
        expires_at: new Date(object.expires_at),
    };
};
