export type ImplicitBearerTokenT = {
    created_at: Date;
    expires_at: Date | null;
    id: string;
};
export type BearerTokenT = ImplicitBearerTokenT & { note: string };
export type NewBearerTokenT = BearerTokenT & { token: string };

// API response
export type RawImplicitBearerTokenT = {
    created_at: string;
    expires_at: string | null;
    id: string;
};
export type RawBearerTokenT = RawImplicitBearerTokenT & { note: string };
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
