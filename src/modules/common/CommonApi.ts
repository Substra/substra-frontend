import API from '@/libs/request';
import { AxiosPromise } from 'axios';

export const retrieveDescription = (url: string): AxiosPromise<string> =>
    API.get(url);

export default {
    retrieveDescription,
};
