import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/libs/request';
import {
    APIListArgsT,
    PaginatedApiResponseT,
} from '@/modules/common/CommonTypes';

import {
    UpdateUserPayloadT,
    ResetPasswordT,
    UserPayloadT,
    UserT,
} from './UsersTypes';

const USERS_URL = {
    LIST: '/users/',
    RETRIEVE: '/users/__KEY__/',
    RESET_TOKEN: '/users/__KEY__/reset_password/',
    CHECK_TOKEN: '/users/__KEY__/verify_token/?token=__TOKEN__',
    RESET_PASSWORD: '/users/__KEY__/set_password/',
};

export const createUser = (payload: UserPayloadT): AxiosPromise<UserT> => {
    return API.post(USERS_URL.LIST, payload);
};

export const listUsers = (
    apiListArgs: APIListArgsT,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<UserT>> =>
    API.authenticatedGet(USERS_URL.LIST, {
        ...getApiOptions(apiListArgs),
        ...config,
    });

export const retrieveUser = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<UserT> =>
    API.authenticatedGet(USERS_URL.RETRIEVE.replace('__KEY__', key), config);

export const updateUser = (
    key: string,
    payload: UpdateUserPayloadT
): AxiosPromise<UserT> =>
    API.put(USERS_URL.RETRIEVE.replace('__KEY__', key), payload);

export const deleteUser = (key: string): AxiosPromise<void> =>
    API.delete(USERS_URL.RETRIEVE.replace('__KEY__', key));

export const requestResetToken = (
    key: string
): AxiosPromise<{ reset_password_token: string }> =>
    API.post(USERS_URL.RESET_TOKEN.replace('__KEY__', key));

export const checkResetTokenValidity = (
    key: string,
    token: string
): AxiosPromise<void> =>
    API.get(
        USERS_URL.CHECK_TOKEN.replace('__KEY__', key).replace(
            '__TOKEN__',
            token
        )
    );

export const resetPassword = (
    key: string,
    payload: ResetPasswordT
): AxiosPromise<void> =>
    API.post(USERS_URL.RESET_PASSWORD.replace('__KEY__', key), payload);
