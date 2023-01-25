import { AxiosPromise } from 'axios';

import API from '@/api/request';
import { API_PATHS } from '@/paths';
import { MeInfoT } from '@/types/MeTypes';

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
    return API.post(API_PATHS.LOGIN, payload);
};

export const getLogOut = (): AxiosPromise<void> => {
    return API.get(API_PATHS.LOGOUT);
};

export const refreshToken = (): AxiosPromise<LoginDataT> => {
    return API.post(API_PATHS.REFRESH);
};

export const retrieveInfo = (
    withCredentials: boolean
): AxiosPromise<MeInfoT> => {
    if (withCredentials) {
        return API.authenticatedGet(API_PATHS.INFO);
    }

    return API.anonymousGet(API_PATHS.INFO);
};
