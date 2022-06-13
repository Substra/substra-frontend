import { AxiosPromise } from 'axios';

import API from '@/libs/request';

import { OrganizationInfoType, OrganizationType } from './OrganizationsTypes';

const URLS = {
    LIST: '/organization/',
    INFO: '/info/',
    METADATA: '/compute_plan_metadata/',
};

export const listOrganizations = (): AxiosPromise<OrganizationType[]> =>
    API.authenticatedGet(URLS.LIST);

export const retrieveInfo = (
    withCredentials: boolean
): AxiosPromise<OrganizationInfoType> => {
    if (withCredentials) {
        return API.authenticatedGet(URLS.INFO);
    }

    return API.anonymousGet(URLS.INFO);
};

export const listMetadata = (): AxiosPromise<string[]> =>
    API.authenticatedGet(URLS.METADATA);
