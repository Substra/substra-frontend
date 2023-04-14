import { useEffect, useRef } from 'react';

import {
    Box,
    CloseButton,
    Flex,
    Icon,
    IconButton,
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { RiNotification3Fill } from 'react-icons/ri';

import NewsFeedList from '@/features/newsFeed/NewsFeedList';
import { ACTUALIZE_NEWS_INTERVAL } from '@/features/newsFeed/NewsFeedUtils';
import useLastNewsSeen from '@/features/newsFeed/useLastNewsSeen';
import useNewsFeedStore from '@/features/newsFeed/useNewsFeedStore';

const NewsFeed = (): JSX.Element => {
    const { onOpen, onClose, isOpen } = useDisclosure();
    const initialFocusRef = useRef(null);
    const { lastNewsSeen, setLastNewsSeen } = useLastNewsSeen();

    const { unseenNewsCount, fetchUnseenNewsCount } = useNewsFeedStore();

    const displayPill = unseenNewsCount > 0;

    useEffect(() => {
        if (lastNewsSeen) {
            fetchUnseenNewsCount(lastNewsSeen);

            const interval = setInterval(() => {
                fetchUnseenNewsCount(lastNewsSeen);
            }, ACTUALIZE_NEWS_INTERVAL);

            return () => {
                clearInterval(interval);
            };
        }
    }, [fetchUnseenNewsCount, lastNewsSeen]);

    return (
        <Box>
            <Popover
                placement="bottom-end"
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                isLazy
                initialFocusRef={initialFocusRef}
            >
                <PopoverTrigger>
                    <Box position="relative">
                        <IconButton
                            aria-label="News feed"
                            icon={
                                <Icon
                                    as={RiNotification3Fill}
                                    color="gray.400"
                                />
                            }
                            variant="solid"
                            colorScheme="gray"
                            size="sm"
                        />
                        {displayPill && (
                            <Flex
                                minWidth="18px"
                                height="18px"
                                color="red"
                                borderRadius={
                                    unseenNewsCount > 99 ? '20%' : '50%'
                                }
                                alignItems="center"
                                justifyContent="center"
                                position="absolute"
                                backgroundColor="red"
                                border="1px solid white"
                                padding="0.5"
                                top="-5px"
                                right={unseenNewsCount > 99 ? '-12px' : '-5px'}
                            >
                                <Text
                                    color="white"
                                    fontSize="8px"
                                    fontWeight="bold"
                                >
                                    {unseenNewsCount > 99
                                        ? '99+'
                                        : unseenNewsCount}
                                </Text>
                            </Flex>
                        )}
                    </Box>
                </PopoverTrigger>
                <PopoverContent
                    outline="ghost"
                    boxShadow="md"
                    width="350px"
                    backgroundColor="gray.50"
                    overflow="hidden"
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
                    <CloseButton
                        onClick={onClose}
                        position="absolute"
                        top="4"
                        right="5"
                        size="sm"
                        ref={initialFocusRef}
                    />
                    <NewsFeedList
                        lastNewsSeen={lastNewsSeen}
                        setLastNewsSeen={setLastNewsSeen}
                    />
                </PopoverContent>
            </Popover>
        </Box>
    );
};
export default NewsFeed;
