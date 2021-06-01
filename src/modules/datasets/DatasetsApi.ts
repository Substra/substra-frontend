import API from '@/libs/request';
import { AxiosPromise } from 'axios';

import { DatasetType, DatasetStubType } from './DatasetsTypes';

const URLS = {
    LIST: '/data_manager/',
    RETRIEVE: '/data_manager/__KEY__/',
};

export const listDatasets = (): AxiosPromise<DatasetStubType[]> =>
    API.get(URLS.LIST);

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
