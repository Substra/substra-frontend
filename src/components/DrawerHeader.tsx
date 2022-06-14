import {
    Skeleton,
    DrawerHeader as ChakraDrawerHeader,
    Heading,
    IconButton,
    HStack,
} from '@chakra-ui/react';
import { RiDownload2Line, RiDownloadLine } from 'react-icons/ri';

import { downloadFromApi } from '@/libs/request';

interface DrawerHeaderProps {
    loading: boolean;
    title?: string;
    onClose: () => void;
    storageAddress?: string;
    filename?: string;
}

const DrawerHeader = ({
    loading,
    title,
    onClose,
    storageAddress,
    filename,
}: DrawerHeaderProps): JSX.Element => (
    <ChakraDrawerHeader
        display="flex"
        justifyContent="space-between"
        paddingX="5"
        paddingY="3"
        alignItems="center"
        borderBottom="1px solid"
        borderBottomColor="gray.100"
    >
        {loading && <Skeleton height="24px" width="250px" />}
        {!loading && (
            <Heading
                noOfLines={1}
                fontSize="md"
                lineHeight="6"
                fontWeight="semibold"
            >
                {title}
            </Heading>
        )}
        <HStack spacing="1">
            {storageAddress && filename && (
                <IconButton
                    aria-label="Download metrics"
                    variant="ghost"
                    fontSize="20px"
                    color="gray.500"
                    icon={<RiDownload2Line />}
                    onClick={() => downloadFromApi(storageAddress, filename)}
                />
            )}
            <IconButton
                aria-label="Close drawer"
                variant="ghost"
                fontSize="20px"
                transform="rotate(-90deg)"
                color="gray.500"
                icon={<RiDownloadLine />}
                onClick={onClose}
            />
        </HStack>
    </ChakraDrawerHeader>
);

export default DrawerHeader;
