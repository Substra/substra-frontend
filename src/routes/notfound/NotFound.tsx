import { Flex } from '@chakra-ui/react';
import { RiFileWarningLine } from 'react-icons/ri';
import { useLocation } from 'wouter';

import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';

import { PATHS } from '@/routes';

import EmptyState from '@/components/EmptyState';

const NotFound = (): JSX.Element => {
    const [, setLocation] = useLocation();

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
            alignSelf="stretch"
        >
            <EmptyState
                icon={<RiFileWarningLine />}
                title="Oops this page does not exist"
                subtitle="You may have mistyped the address or the page may have moved"
                buttonLabel="Go back to home"
                buttonOnClick={() => setLocation(PATHS.HOME)}
            />
        </Flex>
    );
};

export default NotFound;
