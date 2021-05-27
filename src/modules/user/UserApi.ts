import { AxiosPromise } from 'axios';

import API from '@/libs/request';

const USERS_URL = {
    LOGIN: `/user/login/?format=json`,
    LOGOUT: `/user/logout/`,
    REFRESH: '/user/refresh/',
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

export const postLogIn = (payload: loginPayload): AxiosPromise<loginData> => {
    return API.post(USERS_URL.LOGIN, payload);
};

export const getLogOut = (): AxiosPromise<void> => {
    return API.get(USERS_URL.LOGOUT);
};

export const refreshToken = (): AxiosPromise<loginData> => {
    return API.post(USERS_URL.REFRESH);
};
