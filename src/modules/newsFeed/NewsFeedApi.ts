import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API from '@/libs/request';
import { PaginatedApiResponse } from '@/modules/common/CommonTypes';

import { NewsItemType } from './NewsFeedTypes';

const URLS = {
    LIST: '/news_feed/',
};

export const listNewsFeed = (
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<NewsItemType>> => {
    return API.authenticatedGet(URLS.LIST, config);
};
