import { Link, useParams, useRoute } from 'wouter';

import { HStack, Text, Tooltip } from '@chakra-ui/react';

import { compilePath, PATHS } from '@/paths';
import { ComputePlanStatus } from '@/types/ComputePlansTypes';

import useComputePlanStore from '../useComputePlanStore';

type TabsNavItemProps = {
    href: string;
    active: boolean;
    label: string;
    isChartTabDisabled: boolean;
};

const TabsNavItem = ({
    href,
    active,
    label,
    isChartTabDisabled,
}: TabsNavItemProps): JSX.Element => {
    if (isChartTabDisabled) {
        return (
            <Text
                fontSize="sm"
                lineHeight="5"
                fontWeight="medium"
                color="gray.500"
                borderBottomWidth="2px"
                borderBottomStyle="solid"
                borderBottomColor="transparent"
                paddingBottom="2.5"
                cursor="not-allowed"
            >
                <Tooltip
                    label="No performances to display for this status"
                    fontSize="xs"
                    hasArrow
                    placement="top"
                >
                    {label}
                </Tooltip>
            </Text>
        );
    }
    return (
        <Link href={href}>
            <Text
                data-cy={`${label}-tab`}
                as="a"
                fontSize="sm"
                lineHeight="5"
                fontWeight="medium"
                color="gray.800"
                borderBottomWidth="2px"
                borderBottomStyle="solid"
                borderBottomColor={active ? 'primary.500' : 'transparent'}
                paddingBottom="2.5"
            >
                {label}
            </Text>
        </Link>
    );
};

const TabsNav = (): JSX.Element | null => {
    const [isChart] = useRoute(PATHS.COMPUTE_PLAN_CHART);
    const [isTasks] = useRoute(PATHS.COMPUTE_PLAN_TASKS);
    const [isWorkflow] = useRoute(PATHS.COMPUTE_PLAN_WORKFLOW);
    const { key } = useParams();
    const computePlanKey = key || '';
    const { computePlan } = useComputePlanStore();

    const isChartTabDisabled =
        computePlan !== null &&
        ComputePlanStatus.created === computePlan.status;

    return (
        <HStack paddingLeft={8} paddingRight={8} spacing={5}>
            <TabsNavItem
                href={compilePath(PATHS.COMPUTE_PLAN_TASKS, {
                    key: computePlanKey,
                })}
                label="Details"
                active={isTasks}
                isChartTabDisabled={false}
            />
            <TabsNavItem
                href={compilePath(PATHS.COMPUTE_PLAN_WORKFLOW, {
                    key: computePlanKey,
                })}
                label="Workflow"
                active={isWorkflow}
                isChartTabDisabled={false}
            />
            <TabsNavItem
                href={compilePath(PATHS.COMPUTE_PLAN_CHART, {
                    key: computePlanKey,
                })}
                label="Performances"
                active={isChart}
                isChartTabDisabled={isChartTabDisabled}
            />
        </HStack>
    );
};

export default TabsNav;
