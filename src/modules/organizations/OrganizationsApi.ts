import { AxiosPromise } from 'axios';

import API from '@/libs/request';

import { OrganizationT } from './OrganizationsTypes';

const URLS = {
    LIST: '/organization/',
};

export const listOrganizations = (): AxiosPromise<OrganizationT[]> =>
    API.authenticatedGet(URLS.LIST);
