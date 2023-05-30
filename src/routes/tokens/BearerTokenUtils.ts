import {
    BearerTokenT,
    NewBearerTokenT,
    RawBearerTokenT,
    RawNewBearerTokenT,
} from '@/types/BearerTokenTypes';

export const parseToken = (object: RawBearerTokenT): BearerTokenT => {
    return {
        created_at: new Date(object.created_at),
        expires_at: object.expires_at ? new Date(object.expires_at) : null,
        note: object.note,
        id: object.id,
    };
};

export const parseNewToken = (object: RawNewBearerTokenT): NewBearerTokenT => {
    return {
        token: object.token,
        created_at: new Date(object.created_at),
        expires_at: object.expires_at ? new Date(object.expires_at) : null,
        note: object.note,
        id: object.id,
    };
};
