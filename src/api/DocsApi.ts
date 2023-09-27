import { AxiosPromise } from 'axios';

import { DOCS_API } from '@/api/request';
import { DOCS_API_PATHS } from '@/paths';
import { ReleasesInfoT } from '@/types/DocsTypes';

export const retrieveSubstraReleases = (): AxiosPromise<ReleasesInfoT> => {
    return DOCS_API.get(DOCS_API_PATHS.RELEASES);
};
