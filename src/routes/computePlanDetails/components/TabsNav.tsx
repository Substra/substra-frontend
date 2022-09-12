import { Link, useRoute } from 'wouter';

import { HStack, Text, Tooltip } from '@chakra-ui/react';

import useAppSelector from '@/hooks/useAppSelector';
import { ComputePlanStatus } from '@/modules/computePlans/ComputePlansTypes';
import { TaskCategory, TASK_CATEGORY_SLUGS } from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS } from '@/paths';

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
    const [isChart, chartParams] = useRoute(PATHS.COMPUTE_PLAN_CHART);
    const [isTasks, tasksParams] = useRoute(PATHS.COMPUTE_PLAN_TASKS);
    const [isWorkflow, workflowParams] = useRoute(PATHS.COMPUTE_PLAN_WORKFLOW);
    const computePlanKey =
        chartParams?.key || tasksParams?.key || workflowParams?.key || '';
    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );
    const isChartTabDisabled =
        computePlan !== null &&
        [ComputePlanStatus.waiting, ComputePlanStatus.todo].includes(
            computePlan.status
        );

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
