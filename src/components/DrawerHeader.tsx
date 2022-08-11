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
    updateNameButton?: React.ReactNode;
    updateNameDialog?: React.ReactNode;
};

const DrawerHeader = ({
    loading,
    title,
    onClose,
    extraButtons,
    updateNameButton,
    updateNameDialog,
}: DrawerHeaderProps): JSX.Element => (
    <ChakraDrawerHeader
        borderBottom="1px solid"
        borderBottomColor="gray.100"
        display="flex"
        alignItems="center"
        paddingX="5"
        paddingY="3"
    >
        {loading && <Skeleton height="24px" width="250px" />}
        {!loading && (
            <Heading
                noOfLines={1}
                fontSize="md"
                lineHeight="6"
                fontWeight="semibold"
                flexGrow="1"
            >
                {title}
            </Heading>
        )}
        <HStack spacing="1">
            {extraButtons}
            {updateNameButton}
            {updateNameDialog}
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
