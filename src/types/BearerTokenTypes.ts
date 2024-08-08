export type BearerTokenT = {
    created_at: Date;
    expires_at: Date;
    note: string;
    id: string;
};
export type NewBearerTokenT = BearerTokenT & { token: string };

// API response
export type RawBearerTokenT = {
    created_at: string;
    expires_at: string;
    note: string;
    id: string;
};
export type RawNewBearerTokenT = RawBearerTokenT & { token: string };

export const isNewBearerTokenT = (
    newBearerToken: unknown
): newBearerToken is NewBearerTokenT => {
    if (typeof newBearerToken !== 'object') {
        return false;
    }

    return (
        (newBearerToken as NewBearerTokenT).created_at !== undefined &&
        (newBearerToken as NewBearerTokenT).expires_at !== undefined &&
        (newBearerToken as NewBearerTokenT).id !== undefined &&
        (newBearerToken as NewBearerTokenT).note !== undefined &&
        (newBearerToken as NewBearerTokenT).token !== undefined
    );
};
