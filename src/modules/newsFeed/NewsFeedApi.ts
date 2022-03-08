import { NewsItemType } from './NewsFeedTypes';
import { AxiosPromise, AxiosRequestConfig } from 'axios';

import { PaginatedApiResponse } from '@/modules/common/CommonTypes';

import API from '@/libs/request';

const URLS = {
    LIST: '/news_feed/',
};

export const listNewsFeed = (
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<NewsItemType>> => {
    return API.authenticatedGet(URLS.LIST, config);
};
