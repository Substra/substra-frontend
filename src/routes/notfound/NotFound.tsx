import { Button, Flex, Text } from '@chakra-ui/react';
import { RiFileWarningLine } from 'react-icons/ri';
import { Link } from 'wouter';

import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';

import { PATHS } from '@/routes';

const NotFound = (): JSX.Element => {
    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle('Page not found'),
        []
    );

    return (
        <Flex
            backgroundColor="white"
            flexGrow={1}
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
        >
            <Flex
                backgroundColor="gray.100"
                marginBottom="5"
                width={20}
                height={20}
                fontSize="30px"
                alignItems="center"
                justifyContent="center"
            >
                <RiFileWarningLine fill="var(--chakra-colors-gray-300)" />
            </Flex>
            <Text
                fontSize="sm"
                color="gray.500"
                fontWeight="semibold"
                lineHeight="5"
            >
                Oops this page does not exist
            </Text>
            <Text fontSize="xs" color="gray.500">
                You may have mistyped the address or the page may have moved
            </Text>
            <Link href={PATHS.HOME}>
                <Button as="a" variant="outline" marginTop="6" size="sm">
                    Go back to home
                </Button>
            </Link>
        </Flex>
    );
};

export default NotFound;
