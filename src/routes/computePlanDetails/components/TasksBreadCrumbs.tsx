import { BreadcrumbItem, HStack, Text } from '@chakra-ui/react';
import { RiStackshareLine } from 'react-icons/ri';

import useAppSelector from '@/hooks/useAppSelector';
import { PATHS } from '@/paths';

import Breadcrumbs from '@/components/Breadcrumbs';
import Status from '@/components/Status';

const ComputePlanTasksBreadcrumbs = (): JSX.Element => {
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
            <BreadcrumbItem isCurrentPage>
                <HStack spacing="2.5">
                    <Text
                        color="black"
                        fontSize="sm"
                        fontWeight="medium"
                        lineHeight="5"
                    >
                        {computePlanLoading && 'Loading'}
                        {!computePlanLoading && computePlan && computePlan.name}
                    </Text>
                    {!computePlanLoading && computePlan && (
                        <Status
                            size="sm"
                            status={computePlan.status}
                            variant="solid"
                        />
                    )}
                </HStack>
            </BreadcrumbItem>
        </Breadcrumbs>
    );
};

export default ComputePlanTasksBreadcrumbs;
