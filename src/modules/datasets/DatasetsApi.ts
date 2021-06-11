import { AxiosPromise } from 'axios';

import {
    buildSearchFiltersString,
    SearchFilterType,
} from '@/libs/searchFilter';
import API from '@/libs/request';

import { DatasetType, DatasetStubType } from './DatasetsTypes';

const URLS = {
    LIST: '/data_manager/',
    RETRIEVE: '/data_manager/__KEY__/',
};

export const listDatasets = (
    filters: SearchFilterType[]
): AxiosPromise<DatasetStubType[]> => {
    const search = buildSearchFiltersString(filters);

    let options = {};
    if (search) {
        options = { params: { search } };
    }

    return API.get(URLS.LIST, options);
};

export const retrieveDataset = (key: string): AxiosPromise<DatasetType> =>
    API.get(URLS.RETRIEVE.replace('__KEY__', key));

export const retrieveDescription = (url: string): AxiosPromise<string> =>
    API.get(url);

export const retrieveOpener = (url: string): AxiosPromise<string> =>
    API.get(url);

export default {
    listDatasets,
    retrieveDataset,
    retrieveDescription,
    retrieveOpener,
};
