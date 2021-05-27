import API from '@/libs/request';
import { AxiosPromise } from 'axios';

import { DatasetType } from './DatasetsTypes';

const URLS = {
    LIST: '/data_manager/',
    RETRIEVE: '/data_manager/__KEY__',
};

export const listDatasets = (): AxiosPromise<DatasetType[]> =>
    API.get(URLS.LIST);

export const getDataset = (key: string): AxiosPromise<DatasetType> =>
    API.get(URLS.RETRIEVE.replace('__KEY__', key));

export default {
    listDatasets,
    getDataset,
};
