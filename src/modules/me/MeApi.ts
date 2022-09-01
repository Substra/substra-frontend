import { AxiosPromise } from 'axios';

import API from '@/libs/request';

import { MeInfoT } from './MeTypes';

const ME_URL = {
    LOGIN: `/me/login/?format=json`,
    LOGOUT: `/me/logout/`,
    REFRESH: '/me/refresh/',
    INFO: '/info/',
};

export type LoginPayloadT = {
    username: string;
    password: string;
};

export type LoginDataT = {
    exp: number;
    jti: string;
    token_type: string;
    user_id: number;
};

export const postLogIn = (payload: LoginPayloadT): AxiosPromise<LoginDataT> => {
    return API.post(ME_URL.LOGIN, payload);
};

export const getLogOut = (): AxiosPromise<void> => {
    return API.get(ME_URL.LOGOUT);
};

export const refreshToken = (): AxiosPromise<LoginDataT> => {
    return API.post(ME_URL.REFRESH);
};

export const retrieveInfo = (
    withCredentials: boolean
): AxiosPromise<MeInfoT> => {
    if (withCredentials) {
        return API.authenticatedGet(ME_URL.INFO);
    }

    return API.anonymousGet(ME_URL.INFO);
};
