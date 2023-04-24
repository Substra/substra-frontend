import { useEffect, useRef } from 'react';

import {
    Box,
    Button,
    PopoverBody,
    PopoverFooter,
    SlideFade,
    Text,
} from '@chakra-ui/react';
import { RiListCheck2 } from 'react-icons/ri';

import {
    NewsFeedCard,
    NewsFeedCardSkeleton,
} from '@/features/newsFeed/NewsFeedCard';
import useNewsFeedStore, {
    NEWS_FEED_PAGE_SIZE,
} from '@/features/newsFeed/useNewsFeedStore';
import useEffectOnce from '@/hooks/useEffectOnce';

import EmptyState from '@/components/EmptyState';

const NewsFeedListSkeleton = (): JSX.Element => {
    const { newsCount, newsFeedCurrentPage } = useNewsFeedStore();

    let nbItems = NEWS_FEED_PAGE_SIZE;
    const lastPage = Math.ceil(newsCount / NEWS_FEED_PAGE_SIZE);
    // if we're loading the last page, display one card per item on this last page
    if (newsFeedCurrentPage === lastPage - 1) {
        nbItems = newsCount % NEWS_FEED_PAGE_SIZE;
    }
    // handle the case where we don't know how many items there are (itemCount == 0)
    nbItems = nbItems || NEWS_FEED_PAGE_SIZE;

    return (
        <>
            {[...Array(nbItems)].map((_, i) => (
                <NewsFeedCardSkeleton key={i} />
            ))}
        </>
    );
};

type NewsFeedListProps = {
    lastNewsSeen: string;
    setLastNewsSeen: (timestamp: string) => void;
};

const NewsFeedList = ({
    lastNewsSeen,
    setLastNewsSeen,
}: NewsFeedListProps): JSX.Element => {
    const {
        news,
        unseenNewsCount,
        fetchingNews,
        fetchingUnseenNewsCount,
        fetchNews,
    } = useNewsFeedStore();

    const fetchFirstPage = () => {
        fetchNews({ firstPage: true });
    };

    const fetchNextPage = () => {
        fetchNews({
            timestamp_before: lastNewsSeen,
            firstPage: false,
        });
    };

    useEffectOnce(() => {
        setLastNewsSeen(new Date().toISOString());
        fetchFirstPage();
    });

    // infinite scroll
    const rootRef = useRef<HTMLDivElement>(null);
    const probeRef = useRef<HTMLDivElement>(null);
    const callbackRef = useRef<() => void>();
    callbackRef.current = () => {
        if (!fetchingNews) {
            fetchNextPage();
        }
    };

    useEffect(() => {
        if (rootRef.current && probeRef.current) {
            const observer = new IntersectionObserver(
                () => {
                    if (callbackRef.current) {
                        callbackRef.current();
                    }
                },
                {
                    root: rootRef.current,
                    threshold: 1.0,
                }
            );
            observer.observe(probeRef.current);

            return () => {
                observer.disconnect();
            };
        }
    }, []);

    if (!fetchingNews && !news.length) {
        return (
            <Box backgroundColor="white" paddingY="4">
                <EmptyState
                    icon={<RiListCheck2 />}
                    title="Nothing to show yet"
                />
            </Box>
        );
    }

    const onRefresh = () => {
        setLastNewsSeen(new Date().toISOString());
        fetchFirstPage();
        // Scroll back to the top
        if (rootRef.current) {
            rootRef.current.scrollTo(0, 0);
        }
    };

    return (
        <>
            <PopoverBody
                overflowY="scroll"
                maxHeight="80vh"
                maxWidth="350px"
                padding="0"
                ref={rootRef}
                position="relative"
            >
                {news.map((item) => (
                    <NewsFeedCard
                        key={`${item.asset_key}${item.status}`}
                        newsItem={item}
                    />
                ))}
                {fetchingNews && <NewsFeedListSkeleton />}

                <Box ref={probeRef} height="1px" />
            </PopoverBody>
            <PopoverFooter
                padding="0"
                borderTop="0"
                position="absolute"
                width="100%"
                borderRadius="20%"
                bottom="10px"
                paddingLeft="30px"
                paddingRight="30px"
            >
                <SlideFade in={unseenNewsCount > 0} offsetY="130%">
                    <Button
                        size="sm"
                        colorScheme="primary"
                        width="100%"
                        height="100%"
                        isDisabled={fetchingNews || fetchingUnseenNewsCount}
                        onClick={onRefresh}
                        borderRadius="10"
                    >
                        <Text fontSize="xs" paddingY="4">
                            Refresh
                        </Text>
                    </Button>
                </SlideFade>
            </PopoverFooter>
        </>
    );
};
export default NewsFeedList;
