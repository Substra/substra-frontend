import { HStack, Text } from '@chakra-ui/react';
import { Link, useRoute } from 'wouter';

import { TaskCategory } from '@/modules/tasks/TuplesTypes';

import { compilePath, PATHS, ROUTES, TASK_CATEGORY_SLUGS } from '@/routes';

interface TabsNavItemProps {
    href: string;
    active: boolean;
    label: string;
}

const TabsNavItem = ({
    href,
    active,
    label,
}: TabsNavItemProps): JSX.Element => (
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

const TabsNav = (): JSX.Element => {
    const [isChart, chartParams] = useRoute(ROUTES.COMPUTE_PLAN_CHART.path);
    const [isTasks, tasksParams] = useRoute(ROUTES.COMPUTE_PLAN_TASKS.path);
    const computePlanKey = chartParams?.key || tasksParams?.key || '';

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
            />
            <TabsNavItem
                href={compilePath(PATHS.COMPUTE_PLAN_CHART, {
                    key: computePlanKey,
                })}
                label="Performances"
                active={isChart}
            />
        </HStack>
    );
};

export default TabsNav;
