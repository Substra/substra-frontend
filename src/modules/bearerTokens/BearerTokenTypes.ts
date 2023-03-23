type BearerTokenT = {
    payload: string;
    expiration: Date;
};

export const fromRawToken = (token: RawBearerTokenT): BearerTokenT => {
    return {
        payload: token.token,
        expiration: new Date(Date.now() + token.expires_at * 1000),
    };
};

// as returned by the endpoint
export type RawBearerTokenT = {
    token: string;
    expires_at: number; // seconds
};
