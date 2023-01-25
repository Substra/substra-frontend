import { AxiosPromise, AxiosRequestConfig } from 'axios';

import API, { getApiOptions } from '@/api/request';
import { API_PATHS } from '@/paths';
import { PaginatedApiResponseT } from '@/types/CommonTypes';
import { NewsItemT } from '@/types/NewsFeedTypes';

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
    return API.authenticatedGet(API_PATHS.NEWS_FEED, {
        ...getApiOptions(apiListArgs),
        ...config,
    });
};
