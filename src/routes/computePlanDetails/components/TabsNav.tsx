import { HStack, Text, Tooltip } from '@chakra-ui/react';
import { Link, useRoute } from 'wouter';

import { ComputePlanStatus } from '@/modules/computePlans/ComputePlansTypes';
import { TaskCategory } from '@/modules/tasks/TuplesTypes';

import { useAppSelector } from '@/hooks';

import { compilePath, PATHS, ROUTES, TASK_CATEGORY_SLUGS } from '@/routes';

interface TabsNavItemProps {
    href: string;
    active: boolean;
    label: string;
    isChartTabDisabled: boolean;
}

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
                as="a"
                fontSize="sm"
                lineHeight="5"
                fontWeight="medium"
                color="gray.800"
                borderBottomWidth="2px"
                borderBottomStyle="solid"
                borderBottomColor={active ? 'teal.500' : 'transparent'}
                paddingBottom="2.5"
            >
                {label}
            </Text>
        </Link>
    );
};

const TabsNav = (): JSX.Element | null => {
    const [isChart, chartParams] = useRoute(ROUTES.COMPUTE_PLAN_CHART.path);
    const [isTasks, tasksParams] = useRoute(ROUTES.COMPUTE_PLAN_TASKS.path);
    const computePlanKey = chartParams?.key || tasksParams?.key || '';
    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );
    let isChartTabDisabled = true;

    if (
        computePlan !== null &&
        [
            ComputePlanStatus.doing,
            ComputePlanStatus.done,
            ComputePlanStatus.failed,
            ComputePlanStatus.canceled,
        ].includes(computePlan.status)
    ) {
        isChartTabDisabled = false;
    }

    return (
        <HStack paddingLeft={8} paddingRight={8} spacing={5}>
            <TabsNavItem
                href={compilePath(PATHS.COMPUTE_PLAN_TASKS, {
                    category: tasksParams
                        ? tasksParams.category
                        : TASK_CATEGORY_SLUGS[TaskCategory.test],
                    key: computePlanKey,
                })}
                label="Details"
                active={isTasks}
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
