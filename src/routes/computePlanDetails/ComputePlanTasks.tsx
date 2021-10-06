import Breadcrumbs from './components/BreadCrumbs';
import Container from './components/Container';
import TabsNav from './components/TabsNav';
import TaskList from './components/TaskList';
import { useRoute } from 'wouter';

import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';

import { PATHS } from '@/routes';
import TaskSider from '@/routes/tasks/components/TaskSider';

import PageLayout from '@/components/layout/PageLayout';

const ComputePlanTasks = (): JSX.Element => {
    const [, params] = useRoute(PATHS.COMPUTE_PLAN_TASKS);
    const key = params?.key;
    const taskKey = params?.taskKey;

    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle(`${key} (compute plan)`),
        []
    );

    return (
        <>
            <Breadcrumbs />
            <TabsNav />
            <PageLayout siderVisible={!!taskKey} sider={<TaskSider />}>
                <Container>
                    <TaskList />
                </Container>
            </PageLayout>
        </>
    );
};

export default ComputePlanTasks;
