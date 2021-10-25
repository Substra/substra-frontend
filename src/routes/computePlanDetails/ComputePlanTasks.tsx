import { useEffect } from 'react';

import Breadcrumbs from './components/BreadCrumbs';
import DetailsSidebar from './components/DetailsSidebar';
import TabsNav from './components/TabsNav';
import TaskList from './components/TaskList';
import { Box, Flex, HStack } from '@chakra-ui/react';
import { useRoute } from 'wouter';

import { retrieveComputePlan } from '@/modules/computePlans/ComputePlansSlice';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';

import { PATHS } from '@/routes';
import TaskDrawer from '@/routes/tasks/components/TaskDrawer';

const ComputePlanTasks = (): JSX.Element => {
    const [isTasks, tasksParams] = useRoute(PATHS.COMPUTE_PLAN_TASKS);
    const [isTask, taskParams] = useRoute(PATHS.COMPUTE_PLAN_TASK);

    let key: string | undefined;
    if (isTasks) {
        key = tasksParams?.key;
    } else if (isTask) {
        key = taskParams?.key;
    }

    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle(`${key} (compute plan)`),
        []
    );

    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (key && key !== computePlan?.key) {
            dispatch(retrieveComputePlan(key));
        }
    }, [key, computePlan?.key]);

    return (
        <Flex direction="column" alignItems="stretch" flexGrow={1}>
            <TaskDrawer />
            <Box
                background="white"
                borderBottomColor="gray.100"
                borderBottomStyle="solid"
                borderBottomWidth="1px"
            >
                <Breadcrumbs />
                <TabsNav />
            </Box>
            <HStack
                spacing="16"
                padding="8"
                justifyContent="center"
                alignItems="flex-start"
                overflow="auto"
            >
                <TaskList />
                <DetailsSidebar />
            </HStack>
        </Flex>
    );
};

export default ComputePlanTasks;
