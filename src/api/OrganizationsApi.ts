import { AxiosPromise } from 'axios';

import API from '@/api/request';
import { API_PATHS } from '@/paths';
import { OrganizationT } from '@/types/OrganizationsTypes';

export const listOrganizations = (): AxiosPromise<OrganizationT[]> =>
    API.authenticatedGet(API_PATHS.ORGANIZATIONS);
