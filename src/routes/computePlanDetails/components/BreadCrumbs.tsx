import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    Tag,
    Text,
} from '@chakra-ui/react';
import { RiStackshareLine } from 'react-icons/ri';
import { Link } from 'wouter';

import { useAppSelector } from '@/hooks';

import { PATHS } from '@/routes';

import StatusTag from '@/components/StatusTag';

const Breadcrumbs = (): JSX.Element => {
    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );
    const computePlanLoading = useAppSelector(
        (state) => state.computePlans.computePlanLoading
    );
    return (
        <Breadcrumb
            paddingLeft={8}
            paddingRight={8}
            paddingTop={3}
            paddingBottom={3}
        >
            <BreadcrumbItem>
                <Link href={PATHS.COMPUTE_PLANS}>
                    <BreadcrumbLink
                        color="gray.500"
                        fontSize="sm"
                        fontWeight="medium"
                        lineHeight="5"
                    >
                        <Tag backgroundColor="teal.100" marginRight={2.5}>
                            <RiStackshareLine fill="var(--chakra-colors-teal-500)" />
                        </Tag>
                        Compute plans
                    </BreadcrumbLink>
                </Link>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
                <Text
                    color="black"
                    fontSize="sm"
                    fontWeight="medium"
                    lineHeight="5"
                >
                    {computePlanLoading && 'Loading'}
                    {!computePlanLoading && computePlan && (
                        <>
                            {computePlan.tag || 'Untagged compute plan'}
                            <StatusTag
                                status={computePlan.status}
                                size="sm"
                                marginLeft="2.5"
                            />
                        </>
                    )}
                </Text>
            </BreadcrumbItem>
        </Breadcrumb>
    );
};

export default Breadcrumbs;
