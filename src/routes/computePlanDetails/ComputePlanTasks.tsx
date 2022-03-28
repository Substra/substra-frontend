import { useEffect } from 'react';

import { useRoute } from 'wouter';

import { Box, Flex, Heading, HStack, VStack } from '@chakra-ui/react';

import useAppSelector from '@/hooks/useAppSelector';
import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useLocationWithParams from '@/hooks/useLocationWithParams';
import {
    retrieveComputePlan,
    retrieveComputePlanAggregateTasks,
    retrieveComputePlanCompositeTasks,
    retrieveComputePlanTestTasks,
    retrieveComputePlanTrainTasks,
} from '@/modules/computePlans/ComputePlansSlice';
import { TaskCategory } from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS, ROUTES, TASK_CATEGORY_SLUGS } from '@/routes';
import NotFound from '@/routes/notfound/NotFound';
import TaskDrawer from '@/routes/tasks/components/TaskDrawer';

import TasksTable from '@/components/TasksTable';

import Actions from './components/Actions';
import DetailsSidebar from './components/DetailsSidebar';
import TabsNav from './components/TabsNav';
import TasksBreadcrumbs from './components/TasksBreadCrumbs';

interface GenericTasksProps {
    tasksTable: React.ReactNode;
    taskDrawer: React.ReactNode;
}
const GenericTasks = ({
    tasksTable,
    taskDrawer,
}: GenericTasksProps): JSX.Element => {
    const [, params] = useRoute(ROUTES.COMPUTE_PLAN_TASKS.path);
    const key = params?.key;

    useAssetListDocumentTitleEffect(
        `Compute plan ${key}`,
        params?.taskKey || null
    );

    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );
    const loading = useAppSelector(
        (state) => state.computePlans.computePlanLoading
    );

    const dispatchWithAutoAbort = useDispatchWithAutoAbort();
    useEffect(() => {
        if (key && key !== computePlan?.key) {
            return dispatchWithAutoAbort(retrieveComputePlan(key));
        }
    }, [key, computePlan?.key]);

    return (
        <Flex direction="column" alignItems="stretch" flexGrow={1}>
            {taskDrawer}
            <Box
                background="white"
                borderBottomColor="gray.100"
                borderBottomStyle="solid"
                borderBottomWidth="1px"
            >
                <HStack justifyContent="space-between">
                    <TasksBreadcrumbs />
                    <Actions computePlan={computePlan} loading={loading} />
                </HStack>
                <TabsNav />
            </Box>
            <HStack
                spacing="16"
                padding="8"
                justifyContent="center"
                alignItems="flex-start"
                overflow="auto"
            >
                <VStack display="inline-block" spacing="2.5">
                    <Heading size="xxs" textTransform="uppercase">
                        Tasks
                    </Heading>
                    {tasksTable}
                </VStack>
                <DetailsSidebar />
            </HStack>
        </Flex>
    );
};

interface TasksProps {
    computePlanKey: string;
    taskKey: string | undefined;
    compileListPath: (category: TaskCategory) => string;
    compileDetailsPath: (category: TaskCategory, taskKey: string) => string;
}

const TestTasks = ({
    taskKey,
    computePlanKey,
    compileListPath,
    compileDetailsPath,
}: TasksProps): JSX.Element => {
    const {
        params: { search: searchFilters, page },
        setLocationWithParams,
    } = useLocationWithParams();

    const loading = useAppSelector(
        (state) => state.computePlans.computePlanTestTasksLoading
    );
    const list = () =>
        retrieveComputePlanTestTasks({
            computePlanKey,
            page,
            filters: searchFilters,
        });
    const tasks = useAppSelector(
        (state) => state.computePlans.computePlanTestTasks
    );
    const count = useAppSelector(
        (state) => state.computePlans.computePlanTestTasksCount
    );
    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );

    return (
        <GenericTasks
            tasksTable={
                <TasksTable
                    loading={loading}
                    list={list}
                    tasks={tasks}
                    count={count}
                    category={TaskCategory.test}
                    compileListPath={compileListPath}
                    compileDetailsPath={compileDetailsPath}
                    computePlan={computePlan}
                />
            }
            taskDrawer={
                <TaskDrawer
                    category={TaskCategory.test}
                    onClose={() =>
                        setLocationWithParams(
                            compileListPath(TaskCategory.test)
                        )
                    }
                    taskKey={taskKey}
                    setPageTitle={true}
                />
            }
        />
    );
};

const TrainTasks = ({
    taskKey,
    computePlanKey,
    compileListPath,
    compileDetailsPath,
}: TasksProps): JSX.Element => {
    const {
        params: { search: searchFilters, page },
        setLocationWithParams,
    } = useLocationWithParams();

    const loading = useAppSelector(
        (state) => state.computePlans.computePlanTrainTasksLoading
    );
    const list = () =>
        retrieveComputePlanTrainTasks({
            computePlanKey,
            page,
            filters: searchFilters,
        });
    const tasks = useAppSelector(
        (state) => state.computePlans.computePlanTrainTasks
    );
    const count = useAppSelector(
        (state) => state.computePlans.computePlanTrainTasksCount
    );
    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );

    return (
        <GenericTasks
            tasksTable={
                <TasksTable
                    loading={loading}
                    list={list}
                    tasks={tasks}
                    count={count}
                    category={TaskCategory.train}
                    compileListPath={compileListPath}
                    compileDetailsPath={compileDetailsPath}
                    computePlan={computePlan}
                />
            }
            taskDrawer={
                <TaskDrawer
                    category={TaskCategory.train}
                    onClose={() =>
                        setLocationWithParams(
                            compileListPath(TaskCategory.train)
                        )
                    }
                    taskKey={taskKey}
                    setPageTitle={true}
                />
            }
        />
    );
};
const CompositeTasks = ({
    taskKey,
    computePlanKey,
    compileListPath,
    compileDetailsPath,
}: TasksProps): JSX.Element => {
    const {
        params: { search: searchFilters, page },
        setLocationWithParams,
    } = useLocationWithParams();

    const loading = useAppSelector(
        (state) => state.computePlans.computePlanCompositeTasksLoading
    );
    const list = () =>
        retrieveComputePlanCompositeTasks({
            computePlanKey,
            page,
            filters: searchFilters,
        });
    const tasks = useAppSelector(
        (state) => state.computePlans.computePlanCompositeTasks
    );
    const count = useAppSelector(
        (state) => state.computePlans.computePlanCompositeTasksCount
    );
    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );

    return (
        <GenericTasks
            tasksTable={
                <TasksTable
                    loading={loading}
                    list={list}
                    tasks={tasks}
                    count={count}
                    category={TaskCategory.composite}
                    compileListPath={compileListPath}
                    compileDetailsPath={compileDetailsPath}
                    computePlan={computePlan}
                />
            }
            taskDrawer={
                <TaskDrawer
                    category={TaskCategory.composite}
                    onClose={() =>
                        setLocationWithParams(
                            compileListPath(TaskCategory.composite)
                        )
                    }
                    taskKey={taskKey}
                    setPageTitle={true}
                />
            }
        />
    );
};
const AggregateTasks = ({
    taskKey,
    computePlanKey,
    compileListPath,
    compileDetailsPath,
}: TasksProps): JSX.Element => {
    const {
        params: { search: searchFilters, page },
        setLocationWithParams,
    } = useLocationWithParams();

    const loading = useAppSelector(
        (state) => state.computePlans.computePlanAggregateTasksLoading
    );
    const list = () =>
        retrieveComputePlanAggregateTasks({
            computePlanKey,
            page,
            filters: searchFilters,
        });
    const tasks = useAppSelector(
        (state) => state.computePlans.computePlanAggregateTasks
    );
    const count = useAppSelector(
        (state) => state.computePlans.computePlanAggregateTasksCount
    );
    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );

    return (
        <GenericTasks
            tasksTable={
                <TasksTable
                    loading={loading}
                    list={list}
                    tasks={tasks}
                    count={count}
                    category={TaskCategory.aggregate}
                    compileListPath={compileListPath}
                    compileDetailsPath={compileDetailsPath}
                    computePlan={computePlan}
                />
            }
            taskDrawer={
                <TaskDrawer
                    category={TaskCategory.aggregate}
                    onClose={() =>
                        setLocationWithParams(
                            compileListPath(TaskCategory.aggregate)
                        )
                    }
                    taskKey={taskKey}
                    setPageTitle={true}
                />
            }
        />
    );
};

const ComputePlanTasks = () => {
    const [, params] = useRoute(ROUTES.COMPUTE_PLAN_TASKS.path);
    const computePlanKey = params?.key;

    if (!computePlanKey) {
        return <NotFound />;
    }

    const compileListPath = (category: TaskCategory): string => {
        return compilePath(PATHS.COMPUTE_PLAN_TASKS, {
            key: computePlanKey,
            category: TASK_CATEGORY_SLUGS[category],
        });
    };

    const compileDetailsPath = (
        category: TaskCategory,
        taskKey: string
    ): string => {
        return compilePath(PATHS.COMPUTE_PLAN_TASK, {
            key: computePlanKey,
            category: TASK_CATEGORY_SLUGS[category],
            taskKey,
        });
    };

    if (params?.category === 'test') {
        return (
            <TestTasks
                computePlanKey={params?.key}
                taskKey={params?.taskKey}
                compileDetailsPath={compileDetailsPath}
                compileListPath={compileListPath}
            />
        );
    } else if (params?.category === 'train') {
        return (
            <TrainTasks
                computePlanKey={params?.key}
                taskKey={params?.taskKey}
                compileDetailsPath={compileDetailsPath}
                compileListPath={compileListPath}
            />
        );
    } else if (params?.category === 'composite_train') {
        return (
            <CompositeTasks
                computePlanKey={params?.key}
                taskKey={params?.taskKey}
                compileDetailsPath={compileDetailsPath}
                compileListPath={compileListPath}
            />
        );
    } else if (params?.category === 'aggregate') {
        return (
            <AggregateTasks
                computePlanKey={params?.key}
                taskKey={params?.taskKey}
                compileDetailsPath={compileDetailsPath}
                compileListPath={compileListPath}
            />
        );
    } else {
        return <NotFound />;
    }
};

export default ComputePlanTasks;
