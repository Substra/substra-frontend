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

import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import useEffectOnce from '@/hooks/useEffectOnce';
import {
    listNewsFeed,
    NEWS_FEED_PAGE_SIZE,
} from '@/modules/newsFeed/NewsFeedSlice';

import EmptyState from '@/components/EmptyState';
import {
    NewsFeedCard,
    NewsFeedCardSkeleton,
} from '@/components/layout/header/NewsFeedCard';

const NewsFeedListSkeleton = (): JSX.Element => {
    const count = useAppSelector((state) => state.newsFeed.count);
    const currentPage = useAppSelector((state) => state.newsFeed.currentPage);

    let nbItems = NEWS_FEED_PAGE_SIZE;
    const lastPage = Math.ceil(count / NEWS_FEED_PAGE_SIZE);
    // if we're loading the last page, display one card per item on this last page
    if (currentPage === lastPage - 1) {
        nbItems = count % NEWS_FEED_PAGE_SIZE;
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

interface NewsFeedListArgs {
    lastNewsSeen: string;
    setLastNewsSeen: (timestamp: string) => void;
}

const NewsFeedList = ({
    lastNewsSeen,
    setLastNewsSeen,
}: NewsFeedListArgs): JSX.Element => {
    const dispatch = useAppDispatch();
    const items = useAppSelector((state) => state.newsFeed.items);
    const loading = useAppSelector((state) => state.newsFeed.loading);
    const actualizedCountLoading = useAppSelector(
        (state) => state.newsFeed.actualizedCountLoading
    );
    const actualizedCount = useAppSelector(
        (state) => state.newsFeed.actualizedCount
    );
    const promiseRef = useRef<{ abort: () => void } | null>(null);

    const fetchFirstPage = () => {
        if (promiseRef.current) {
            promiseRef.current.abort();
        }

        promiseRef.current = dispatch(listNewsFeed({ firstPage: true }));
    };

    const fetchNextPage = () => {
        if (promiseRef.current) {
            promiseRef.current.abort();
        }

        promiseRef.current = dispatch(
            listNewsFeed({
                timestamp_before: lastNewsSeen,
                firstPage: false,
            })
        );
    };

    useEffectOnce(() => {
        setLastNewsSeen(new Date().toISOString());
        fetchFirstPage();

        return () => {
            if (promiseRef.current) {
                promiseRef.current.abort();
            }
        };
    });

    // infinite scroll
    const rootRef = useRef<HTMLDivElement>(null);
    const probeRef = useRef<HTMLDivElement>(null);
    const callbackRef = useRef<() => void>();
    callbackRef.current = () => {
        if (!loading) {
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

    if (!loading && !items.length) {
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
                {items.map((item) => (
                    <NewsFeedCard
                        key={`${item.asset_key}${item.status}`}
                        newsItem={item}
                    />
                ))}
                {loading && <NewsFeedListSkeleton />}

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
                <SlideFade in={actualizedCount > 0} offsetY="130%">
                    <Button
                        size="sm"
                        colorScheme="teal"
                        width="100%"
                        height="100%"
                        isDisabled={loading || actualizedCountLoading}
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
