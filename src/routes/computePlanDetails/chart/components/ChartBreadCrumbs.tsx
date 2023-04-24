import { useContext } from 'react';

import { BreadcrumbItem, HStack, Text, Link } from '@chakra-ui/react';
import { RiStackshareLine } from 'react-icons/ri';

import { PerfBrowserContext } from '@/features/perfBrowser/usePerfBrowser';
import { PATHS } from '@/paths';

import Breadcrumbs from '@/components/Breadcrumbs';
import Status from '@/components/Status';

import useComputePlanStore from '../../useComputePlanStore';

const ComputePlanChartBreadcrumbs = (): JSX.Element => {
    const { selectedMetricName, setSelectedMetricName } =
        useContext(PerfBrowserContext);

    const { computePlan, fetchingComputePlan } = useComputePlanStore();

    return (
        <Breadcrumbs
            rootPath={PATHS.COMPUTE_PLANS}
            rootLabel="Compute plans"
            rootIcon={RiStackshareLine}
        >
            <BreadcrumbItem
                isCurrentPage={fetchingComputePlan || !selectedMetricName}
            >
                <HStack spacing="2.5">
                    {selectedMetricName ? (
                        <Link
                            color="gray.500"
                            fontSize="sm"
                            fontWeight="medium"
                            lineHeight="5"
                            onClick={() => setSelectedMetricName('')}
                        >
                            {fetchingComputePlan && 'Loading'}
                            {!fetchingComputePlan &&
                                computePlan &&
                                computePlan.name}
                        </Link>
                    ) : (
                        <Text
                            color="black"
                            fontSize="sm"
                            fontWeight="medium"
                            lineHeight="5"
                        >
                            {fetchingComputePlan && 'Loading'}
                            {!fetchingComputePlan &&
                                computePlan &&
                                computePlan.name}
                        </Text>
                    )}
                    {!fetchingComputePlan && computePlan && (
                        <Status
                            size="sm"
                            status={computePlan.status}
                            variant="solid"
                        />
                    )}
                </HStack>
            </BreadcrumbItem>
            {!fetchingComputePlan && selectedMetricName && (
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

export default ComputePlanChartBreadcrumbs;
