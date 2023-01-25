import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/api/request';
import { API_PATHS, compilePath } from '@/paths';
import { APIListArgsT, PaginatedApiResponseT } from '@/types/CommonTypes';
import {
    UpdateUserPayloadT,
    ResetPasswordT,
    UserPayloadT,
    UserT,
} from '@/types/UsersTypes';

export const createUser = (payload: UserPayloadT): AxiosPromise<UserT> => {
    return API.post(API_PATHS.USERS, payload);
};

export const listUsers = (
    apiListArgs: APIListArgsT,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<UserT>> =>
    API.authenticatedGet(API_PATHS.USERS, {
        ...getApiOptions(apiListArgs),
        ...config,
    });

export const retrieveUser = (
    key: string,
    config: AxiosRequestConfig
): AxiosPromise<UserT> =>
    API.authenticatedGet(compilePath(API_PATHS.USER, { key }), config);

export const updateUser = (
    key: string,
    payload: UpdateUserPayloadT
): AxiosPromise<UserT> =>
    API.put(compilePath(API_PATHS.USER, { key }), payload);

export const deleteUser = (key: string): AxiosPromise<void> =>
    API.delete(compilePath(API_PATHS.USER, { key }));

export const requestResetToken = (
    key: string
): AxiosPromise<{ reset_password_token: string }> =>
    API.post(compilePath(API_PATHS.USER_RESET_TOKEN, { key }));

export const checkResetTokenValidity = (
    key: string,
    token: string
): AxiosPromise<void> =>
    API.get(compilePath(API_PATHS.USER_CHECK_TOKEN, { key, token }));

export const resetPassword = (
    key: string,
    payload: ResetPasswordT
): AxiosPromise<void> =>
    API.post(compilePath(API_PATHS.USER_SET_PWD, { key }), payload);
