import {
    Skeleton,
    DrawerHeader as ChakraDrawerHeader,
    Heading,
    IconButton,
    HStack,
} from '@chakra-ui/react';
import { RiDownloadLine } from 'react-icons/ri';

type DrawerHeaderProps = {
    loading: boolean;
    title?: string;
    onClose: () => void;
    extraButtons?: React.ReactNode;
};

const DrawerHeader = ({
    loading,
    title,
    onClose,
    extraButtons,
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
            {extraButtons}
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
