import API from '@/libs/request';

const USERS_URL = {
    LOGIN: `/user/login/?format=json`,
    LOGOUT: `/user/logout/`,
};

export type loginPayload = {
    username: string;
    password: string;
};

export type loginData = {
    exp: number;
    jti: string;
    token_type: string;
    user_id: number;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const postLogIn = (payload: loginPayload) => {
    return API.post(USERS_URL.LOGIN, payload);
};

export const postLogOut = (): Promise<void> => {
    return API.get(USERS_URL.LOGOUT);
};
