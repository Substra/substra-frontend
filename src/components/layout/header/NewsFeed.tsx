import {
    Box,
    Icon,
    IconButton,
    Popover,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
} from '@chakra-ui/react';
import { RiNotification3Fill } from 'react-icons/ri';

import NewsFeedList from '@/components/layout/header/NewsFeedList';

const NewsFeed = (): JSX.Element => {
    return (
        <Box>
            <Popover placement="bottom-end" autoFocus={false} isLazy>
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
                    <NewsFeedList />
                </PopoverContent>
            </Popover>
        </Box>
    );
};
export default NewsFeed;
