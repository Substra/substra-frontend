import { useContext } from 'react';

import { BreadcrumbItem, HStack, Text, Link } from '@chakra-ui/react';
import { RiStackshareLine } from 'react-icons/ri';

import { getMelloddyName } from '@/modules/computePlans/ComputePlanUtils';

import { useAppSelector } from '@/hooks';
import { PerfBrowserContext } from '@/hooks/usePerfBrowser';

import { PATHS } from '@/routes';

import Breadcrumbs from '@/components/Breadcrumbs';
import Status from '@/components/Status';

const ComputePlanChartBreadcrumbs = (): JSX.Element => {
    const { selectedMetricName, setSelectedMetricName } =
        useContext(PerfBrowserContext);

    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );
    const computePlanLoading = useAppSelector(
        (state) => state.computePlans.computePlanLoading
    );

    return (
        <Breadcrumbs
            rootPath={PATHS.COMPUTE_PLANS}
            rootLabel="Compute plans"
            rootIcon={RiStackshareLine}
        >
            <BreadcrumbItem
                isCurrentPage={computePlanLoading || !selectedMetricName}
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
                            {computePlanLoading && 'Loading'}
                            {!computePlanLoading &&
                                computePlan &&
                                (MELLODDY
                                    ? getMelloddyName(computePlan)
                                    : computePlan.tag ||
                                      'Untagged compute plan')}
                        </Link>
                    ) : (
                        <Text
                            color="black"
                            fontSize="sm"
                            fontWeight="medium"
                            lineHeight="5"
                        >
                            {computePlanLoading && 'Loading'}
                            {!computePlanLoading &&
                                computePlan &&
                                (MELLODDY
                                    ? getMelloddyName(computePlan)
                                    : computePlan.tag ||
                                      'Untagged compute plan')}
                        </Text>
                    )}
                    {!computePlanLoading && computePlan && (
                        <Status
                            size="sm"
                            status={computePlan.status}
                            variant="solid"
                        />
                    )}
                </HStack>
            </BreadcrumbItem>
            {!computePlanLoading && selectedMetricName && (
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
