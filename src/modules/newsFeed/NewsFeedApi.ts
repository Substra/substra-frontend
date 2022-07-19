import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/libs/request';
import { PaginatedApiResponseT } from '@/modules/common/CommonTypes';

import { NewsItemT } from './NewsFeedTypes';

const URLS = {
    LIST: '/news_feed/',
};

type ListNewsFeedArgsProps = {
    page?: number;
    pageSize?: number;
    timestamp_before?: string;
    timestamp_after?: string;
    important_news_only?: boolean;
    ordering?: 'timestamp' | '-timestamp';
};

export const listNewsFeed = (
    apiListArgs: ListNewsFeedArgsProps,
    config: AxiosRequestConfig
): AxiosPromise<PaginatedApiResponseT<NewsItemT>> => {
    return API.authenticatedGet(URLS.LIST, {
        ...getApiOptions(apiListArgs),
        ...config,
    });
};
