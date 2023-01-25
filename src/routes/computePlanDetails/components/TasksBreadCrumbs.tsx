import { BreadcrumbItem, HStack, Text } from '@chakra-ui/react';
import { RiStackshareLine } from 'react-icons/ri';

import { PATHS } from '@/paths';

import Breadcrumbs from '@/components/Breadcrumbs';
import Status from '@/components/Status';

import useComputePlanStore from '../useComputePlanStore';

const ComputePlanTasksBreadcrumbs = (): JSX.Element => {
    const { computePlan, fetchingComputePlan } = useComputePlanStore();

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
                        {fetchingComputePlan && 'Loading'}
                        {!fetchingComputePlan &&
                            computePlan &&
                            computePlan.name}
                    </Text>
                    {!fetchingComputePlan && computePlan && (
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
