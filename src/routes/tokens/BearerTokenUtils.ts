import {
    BearerTokenT,
    NewBearerTokenT,
    RawBearerTokenT,
    RawNewBearerTokenT,
    RawImplicitBearerTokenT,
    ImplicitBearerTokenT,
} from '@/types/BearerTokenTypes';

export const parseImplicitToken = (
    object: RawImplicitBearerTokenT
): ImplicitBearerTokenT => {
    return {
        created_at: new Date(object.created_at),
        expires_at: object.expires_at ? new Date(object.expires_at) : null,
        id: object.id,
    };
};

export const parseToken = (object: RawBearerTokenT): BearerTokenT => {
    return {
        ...parseImplicitToken(object as RawImplicitBearerTokenT),
        ...{ note: object.note },
    };
};

export const parseNewToken = (object: RawNewBearerTokenT): NewBearerTokenT => {
    return {
        ...parseToken(object as RawBearerTokenT),
        ...{ token: object.token },
    };
};
