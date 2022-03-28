import { useEffect } from 'react';

import {
    Box,
    Button,
    Icon,
    IconButton,
    Popover,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverFooter,
    PopoverHeader,
    PopoverTrigger,
    Text,
} from '@chakra-ui/react';
import { RiListCheck2, RiNotification3Fill } from 'react-icons/ri';

import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import { listNewsFeed } from '@/modules/newsFeed/NewsFeedSlice';
import { NewsItemType } from '@/modules/newsFeed/NewsFeedTypes';

import EmptyState from '@/components/EmptyState';

import { NewsFeedCard, NewsFeedCardSkeleton } from './NewsFeedCard';

const NewsFeed = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const newsFeedLoading = useAppSelector(
        (state) => state.newsFeed.newsFeedLoading
    );
    const data: NewsItemType[] = useAppSelector(
        (state) => state.newsFeed.newsFeed
    );
    const dispatchWithAutoAbort = useDispatchWithAutoAbort();

    useEffect(() => {
        return dispatchWithAutoAbort(listNewsFeed());
    }, []);

    return (
        <Box>
            <Popover placement="bottom-end" autoFocus={false}>
                <PopoverTrigger>
                    <IconButton
                        aria-label="News feed"
                        icon={
                            <Icon as={RiNotification3Fill} color="gray.400" />
                        }
                        variant="solid"
                        colorScheme="gray"
                        size="sm"
                    />
                </PopoverTrigger>
                <PopoverContent
                    outline="ghost"
                    boxShadow="md"
                    width="350px"
                    backgroundColor="gray.50"
                >
                    <PopoverHeader
                        fontSize="xs"
                        fontWeight="bold"
                        textTransform="uppercase"
                        paddingX="5"
                        paddingY="4"
                        borderBottom="0"
                    >
                        notifications
                    </PopoverHeader>
                    <PopoverCloseButton marginTop="3" marginRight="3" />
                    {data.length === 0 ? (
                        <Box backgroundColor="white" paddingY="4">
                            <EmptyState
                                icon={<RiListCheck2 />}
                                title="Nothing to show yet"
                            />
                        </Box>
                    ) : (
                        <>
                            <PopoverBody
                                overflowY="scroll"
                                maxHeight="80vh"
                                padding="0" //padding is handled in NewsFeedCard
                            >
                                {newsFeedLoading
                                    ? [...Array(6)].map((_, i) => (
                                          <NewsFeedCardSkeleton key={i} />
                                      ))
                                    : data.map((news) => (
                                          <NewsFeedCard
                                              key={`${news.asset_key}${news.status}`}
                                              newsItem={news}
                                          />
                                      ))}
                            </PopoverBody>
                            <PopoverFooter padding="0" borderTop="0">
                                <Button
                                    size="sm"
                                    background="gray.50"
                                    width="100%"
                                    height="100%"
                                    align="center"
                                    disabled={newsFeedLoading}
                                    onClick={() => dispatch(listNewsFeed())}
                                >
                                    <Text
                                        color="teal.600"
                                        fontSize="xs"
                                        paddingY="4"
                                    >
                                        Refresh
                                    </Text>
                                </Button>
                            </PopoverFooter>
                        </>
                    )}
                </PopoverContent>
            </Popover>
        </Box>
    );
};
export default NewsFeed;
