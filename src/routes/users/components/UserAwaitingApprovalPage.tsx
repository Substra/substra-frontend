import { VStack, Center } from '@chakra-ui/react';
import { RiTimeLine } from 'react-icons/ri';

import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';

import EmptyState from '@/components/EmptyState';

const UserAwaitingApprovalPage = (): JSX.Element => {
    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle('Waiting for access'),
        []
    );
    return (
        <Center height="100vh">
            <VStack spacing="2.5">
                <EmptyState
                    icon={<RiTimeLine />}
                    title="Waiting for your access to be validated"
                    subtitle="Your administrator has received your demand, please reach out to them in case you have any issue."
                />
            </VStack>
        </Center>
    );
};
export default UserAwaitingApprovalPage;
