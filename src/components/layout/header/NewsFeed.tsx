import { useRef } from 'react';

import {
    Box,
    CloseButton,
    Icon,
    IconButton,
    Popover,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    useDisclosure,
} from '@chakra-ui/react';
import { RiNotification3Fill } from 'react-icons/ri';

import NewsFeedList from '@/components/layout/header/NewsFeedList';

const NewsFeed = (): JSX.Element => {
    const { onOpen, onClose, isOpen } = useDisclosure();
    const initialFocusRef = useRef(null);

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
                    <CloseButton
                        onClick={onClose}
                        position="absolute"
                        top="4"
                        right="5"
                        size="sm"
                        ref={initialFocusRef}
                    />
                    <NewsFeedList />
                </PopoverContent>
            </Popover>
        </Box>
    );
};
export default NewsFeed;
