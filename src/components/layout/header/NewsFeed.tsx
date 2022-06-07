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

import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import useLastNewsSeen from '@/hooks/useLastNewsSeen';
import { retrieveActualizedCount } from '@/modules/newsFeed/NewsFeedSlice';
import { ACTUALIZE_NEWS_INTERVAL } from '@/modules/newsFeed/NewsFeedUtils';

import NewsFeedList from '@/components/layout/header/NewsFeedList';

const NewsFeed = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const { onOpen, onClose, isOpen } = useDisclosure();
    const initialFocusRef = useRef(null);
    const { lastNewsSeen, setLastNewsSeen } = useLastNewsSeen();

    const actualizedCount = useAppSelector(
        (state) => state.newsFeed.actualizedCount
    );

    const displayPill = actualizedCount > 0;

    useEffect(() => {
        if (lastNewsSeen) {
            dispatch(
                retrieveActualizedCount({ timestamp_after: lastNewsSeen })
            );

            const interval = setInterval(() => {
                dispatch(
                    retrieveActualizedCount({ timestamp_after: lastNewsSeen })
                );
            }, ACTUALIZE_NEWS_INTERVAL);

            return () => {
                clearInterval(interval);
            };
        }
    }, [dispatch, lastNewsSeen]);

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
                                    actualizedCount > 99 ? '20%' : '50%'
                                }
                                alignItems="center"
                                justifyContent="center"
                                position="absolute"
                                backgroundColor="red"
                                border="1px solid white"
                                padding="0.5"
                                top="-5px"
                                right={actualizedCount > 99 ? '-12px' : '-5px'}
                            >
                                <Text
                                    color="white"
                                    fontSize="8px"
                                    fontWeight="bold"
                                >
                                    {actualizedCount > 99
                                        ? '99+'
                                        : actualizedCount}
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
