export type BearerTokenT = {
    created_at: Date;
    expires_at: Date;
};
export type NewBearerTokenT = BearerTokenT & { token: string };

// API response
export type RawBearerTokenT = {
    created_at: string;
    expires_at: string;
};
export type RawNewBearerTokenT = RawBearerTokenT & { token: string };
