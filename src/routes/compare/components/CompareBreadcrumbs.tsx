import { useContext } from 'react';

import { BreadcrumbItem, HStack, Text, Link } from '@chakra-ui/react';
import { RiStackshareLine } from 'react-icons/ri';

import { PerfBrowserContext } from '@/features/perfBrowser/usePerfBrowser';
import { PATHS } from '@/paths';

import Breadcrumbs from '@/components/Breadcrumbs';

const CompareBreadcrumbs = (): JSX.Element => {
    const { selectedIdentifier, setSelectedIdentifier } =
        useContext(PerfBrowserContext);

    return (
        <Breadcrumbs
            rootPath={PATHS.COMPUTE_PLANS}
            rootLabel="Compute plans"
            rootIcon={RiStackshareLine}
        >
            <BreadcrumbItem isCurrentPage={!selectedIdentifier}>
                <HStack spacing="2.5">
                    {selectedIdentifier ? (
                        <Link
                            color="gray.500"
                            fontSize="sm"
                            fontWeight="medium"
                            lineHeight="5"
                            onClick={() => setSelectedIdentifier('')}
                        >
                            Comparison
                        </Link>
                    ) : (
                        <Text
                            color="black"
                            fontSize="sm"
                            fontWeight="medium"
                            lineHeight="5"
                        >
                            Comparison
                        </Text>
                    )}
                </HStack>
            </BreadcrumbItem>
            {selectedIdentifier && (
                <BreadcrumbItem isCurrentPage>
                    <Text
                        color="black"
                        fontSize="sm"
                        fontWeight="medium"
                        lineHeight="5"
                    >
                        {selectedIdentifier}
                    </Text>
                </BreadcrumbItem>
            )}
        </Breadcrumbs>
    );
};

export default CompareBreadcrumbs;
