import { useContext } from 'react';

import { BreadcrumbItem, HStack, Text, Link } from '@chakra-ui/react';
import { RiStackshareLine } from 'react-icons/ri';

import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

import { PATHS } from '@/routes';

import Breadcrumbs from '@/components/Breadcrumbs';

const CompareBreadcrumbs = (): JSX.Element => {
    const { selectedMetricName, setSelectedMetricName } =
        useContext(PerfBrowserContext);

    return (
        <Breadcrumbs
            rootPath={PATHS.COMPUTE_PLANS}
            rootLabel="Compute plans"
            rootIcon={RiStackshareLine}
        >
            <BreadcrumbItem isCurrentPage={!selectedMetricName}>
                <HStack spacing="2.5">
                    {selectedMetricName ? (
                        <Link
                            color="gray.500"
                            fontSize="sm"
                            fontWeight="medium"
                            lineHeight="5"
                            onClick={() => setSelectedMetricName('')}
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
            {selectedMetricName && (
                <BreadcrumbItem isCurrentPage>
                    <Text
                        color="black"
                        fontSize="sm"
                        fontWeight="medium"
                        lineHeight="5"
                    >
                        {selectedMetricName}
                    </Text>
                </BreadcrumbItem>
            )}
        </Breadcrumbs>
    );
};

export default CompareBreadcrumbs;
