import { AxiosPromise } from 'axios';

import API from '@/libs/request';

import { OrganizationType } from './OrganizationsTypes';

const URLS = {
    LIST: '/organization/',
};

export const listOrganizations = (): AxiosPromise<OrganizationType[]> =>
    API.authenticatedGet(URLS.LIST);
