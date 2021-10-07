import Breadcrumbs from './components/BreadCrumbs';
import TabsNav from './components/TabsNav';
import TaskList from './components/TaskList';
import { Box, Flex } from '@chakra-ui/react';
import { useRoute } from 'wouter';

import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';

import { PATHS } from '@/routes';
import TaskSider from '@/routes/tasks/components/TaskSider';

const ComputePlanTasks = (): JSX.Element => {
    const [, params] = useRoute(PATHS.COMPUTE_PLAN_TASKS);
    const key = params?.key;

    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle(`${key} (compute plan)`),
        []
    );

    return (
        <Flex direction="column" alignItems="stretch" flexGrow={1}>
            <TaskSider />
            <Box background="white">
                <Breadcrumbs />
                <TabsNav />
            </Box>
            <TaskList />
        </Flex>
    );
};

export default ComputePlanTasks;
