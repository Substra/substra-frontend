import { useLocation } from 'wouter';

import { Flex } from '@chakra-ui/react';
import { RiFileWarningLine } from 'react-icons/ri';

import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import { PATHS } from '@/paths';

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
