import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/libs/request';
import { PaginatedApiResponse } from '@/modules/common/CommonTypes';

import { NewsItemType } from './NewsFeedTypes';

const URLS = {
    LIST: '/news_feed/',
};

type ListNewsFeedArgs = {
    page?: number;
    pageSize?: number;
};

export const listNewsFeed = (
    apiListArgs: ListNewsFeedArgs,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponse<NewsItemType>> => {
    return API.authenticatedGet(URLS.LIST, {
        ...getApiOptions(apiListArgs),
        ...config,
    });
};
