export type BearerTokenT = {
    created: Date;
    expires_at: Date;
};

export type NewBearerTokenT = BearerTokenT & { token: string };

export type BunchOfBearerTokensT = {
    tokens: BearerTokenT[];
};
