import { useEffect, useRef } from 'react';

import { useLocation } from 'wouter';

import { Button } from '@chakra-ui/react';
import { RiArrowRightLine } from 'react-icons/ri';

import * as NewsFeedApi from '@/api/NewsFeedApi';
import { ACTUALIZE_NEWS_INTERVAL } from '@/features/newsFeed/NewsFeedUtils';
import { NEWS_FEED_PAGE_SIZE } from '@/features/newsFeed/useNewsFeedStore';
import { useToast } from '@/hooks/useToast';
import { getAllPages } from '@/libs/CommonUtils';
import { timestampNow } from '@/libs/utils';
import { compilePath, PATHS } from '@/paths';
import {
    getNewsItemAssetLabel,
    getNewsItemStatusLabel,
    NewsItemStatus,
    NewsItemT,
} from '@/types/NewsFeedTypes';

const buildToastDescription =
    (setLocation: (location: string) => void, news: NewsItemT) =>
    ({ onClose }: { onClose: () => void }): JSX.Element =>
        (
            <Button
                rightIcon={<RiArrowRightLine />}
                variant="ghost"
                size="sm"
                marginLeft="-3"
                onClick={() => {
                    setLocation(
                        compilePath(PATHS.COMPUTE_PLAN_TASKS, {
                            key: news.asset_key,
                        })
                    );
                    onClose();
                }}
            >
                Go to asset location
            </Button>
        );

const Actualizer = (): null => {
    const [, setLocation] = useLocation();
    const toast = useToast();

    const timestampAfterRef = useRef<string>(timestampNow());

    useEffect(() => {
        const getImportantNews = async () => {
            const pageSize = NEWS_FEED_PAGE_SIZE;

            const importantNews = await getAllPages<NewsItemT>(
                (page) =>
                    NewsFeedApi.listNewsFeed(
                        {
                            page,
                            pageSize,
                            timestamp_after: timestampAfterRef.current,
                            important_news_only: true,
                            ordering: '-timestamp',
                        },
                        {}
                    ),
                pageSize
            );
            timestampAfterRef.current = timestampNow();

            for (const news of importantNews) {
                toast({
                    status: `${
                        news.status === NewsItemStatus.failed
                            ? 'error'
                            : 'success'
                    }`,
                    title: `${getNewsItemAssetLabel(news.asset_kind)} ${
                        news.name
                    } ${getNewsItemStatusLabel(news.status)} !`,
                    isClosable: true,
                    descriptionComponent: buildToastDescription(
                        setLocation,
                        news
                    ),
                });
            }
        };

        const interval = setInterval(getImportantNews, ACTUALIZE_NEWS_INTERVAL);

        return () => clearInterval(interval);
    }, [toast, timestampAfterRef, setLocation]);

    return null;
};

export default Actualizer;
