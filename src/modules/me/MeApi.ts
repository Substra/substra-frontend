import { AxiosPromise } from 'axios';

import API from '@/libs/request';

import { MeInfoType } from './MeTypes';

const ME_URL = {
    LOGIN: `/user/login/?format=json`,
    LOGOUT: `/user/logout/`,
    REFRESH: '/user/refresh/',
    INFO: '/info/',
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
    return API.post(ME_URL.LOGIN, payload);
};

export const getLogOut = (): AxiosPromise<void> => {
    return API.get(ME_URL.LOGOUT);
};

export const refreshToken = (): AxiosPromise<loginData> => {
    return API.post(ME_URL.REFRESH);
};

export const retrieveInfo = (
    withCredentials: boolean
): AxiosPromise<MeInfoType> => {
    if (withCredentials) {
        return API.authenticatedGet(ME_URL.INFO);
    }

    return API.anonymousGet(ME_URL.INFO);
};
