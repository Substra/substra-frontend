export type BearerTokenT = {
    created_at: Date;
    expires_at: Date | null;
    note: string;
    id: string;
};
export type NewBearerTokenT = BearerTokenT & { token: string };

// API response
export type RawBearerTokenT = {
    created_at: string;
    expires_at: string | null;
    note: string;
    id: string;
};
export type RawNewBearerTokenT = RawBearerTokenT & { token: string };
