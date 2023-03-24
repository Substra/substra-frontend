export type BearerTokenT = {
    created: Date;
    expires_at: Date;
};
export type NewBearerTokenT = BearerTokenT & { token: string };

// API response
export type RawBearerTokenT = {
    created: string;
    expires_at: string;
};
export type RawNewBearerTokenT = RawBearerTokenT & { token: string };
