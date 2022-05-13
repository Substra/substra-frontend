import { useCallback, useEffect } from 'react';

import { useRoute } from 'wouter';

import { Box, Flex, Heading, HStack, VStack } from '@chakra-ui/react';

import useAppSelector from '@/hooks/useAppSelector';
import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import { useSetLocationPreserveParams } from '@/hooks/useLocationWithParams';
import {
    useCreationDate,
    useEndDate,
    useMatch,
    useOrdering,
    usePage,
    useStartDate,
    useStatus,
    useWorker,
} from '@/hooks/useSyncedState';
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
    onRefresh: () => void;
    tasksLoading: boolean;
}
const GenericTasks = ({
    tasksTable,
    taskDrawer,
    onRefresh,
    tasksLoading,
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
    }, [key, computePlan?.key, dispatchWithAutoAbort]);

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
                    <Actions
                        computePlan={computePlan}
                        loading={loading}
                        onRefresh={onRefresh}
                        tasksLoading={tasksLoading}
                    />
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
                <VStack display="inline-block" spacing="2.5" flexGrow="1">
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
    const dispatchWithAutoAbort = useDispatchWithAutoAbort();
    const [page] = usePage();
    const [match] = useMatch();
    const [ordering] = useOrdering('-rank');
    const [status] = useStatus();
    const [worker] = useWorker();
    const { creationDateBefore, creationDateAfter } = useCreationDate();
    const { startDateBefore, startDateAfter } = useStartDate();
    const { endDateBefore, endDateAfter } = useEndDate();
    const setLocationPreserveParams = useSetLocationPreserveParams();

    const loading = useAppSelector(
        (state) => state.computePlans.computePlanTestTasksLoading
    );
    const list = useCallback(
        () =>
            retrieveComputePlanTestTasks({
                computePlanKey,
                page,
                ordering,
                match,
                status,
                worker,
                creation_date_after: creationDateAfter,
                creation_date_before: creationDateBefore,
                start_date_after: startDateAfter,
                start_date_before: startDateBefore,
                end_date_after: endDateAfter,
                end_date_before: endDateBefore,
            }),
        [
            computePlanKey,
            creationDateAfter,
            creationDateBefore,
            endDateAfter,
            endDateBefore,
            match,
            ordering,
            page,
            startDateAfter,
            startDateBefore,
            status,
            worker,
        ]
    );
    const tasks = useAppSelector(
        (state) => state.computePlans.computePlanTestTasks
    );
    const count = useAppSelector(
        (state) => state.computePlans.computePlanTestTasksCount
    );
    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );

    const onRefresh = () => {
        dispatchWithAutoAbort(
            retrieveComputePlanTestTasks({
                computePlanKey,
                page,
                ordering,
                match,
                status,
                worker,
                creation_date_after: creationDateAfter,
                creation_date_before: creationDateBefore,
                start_date_after: startDateAfter,
                start_date_before: startDateBefore,
                end_date_after: endDateAfter,
                end_date_before: endDateBefore,
            })
        );
    };

    return (
        <GenericTasks
            tasksLoading={loading}
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
                    tableProps={{ width: '100%' }}
                />
            }
            taskDrawer={
                <TaskDrawer
                    category={TaskCategory.test}
                    onClose={() =>
                        setLocationPreserveParams(
                            compileListPath(TaskCategory.test)
                        )
                    }
                    taskKey={taskKey}
                    setPageTitle={true}
                />
            }
            onRefresh={onRefresh}
        />
    );
};

const TrainTasks = ({
    taskKey,
    computePlanKey,
    compileListPath,
    compileDetailsPath,
}: TasksProps): JSX.Element => {
    const dispatchWithAutoAbort = useDispatchWithAutoAbort();
    const [page] = usePage();
    const [match] = useMatch();
    const [ordering] = useOrdering('-rank');
    const [status] = useStatus();
    const [worker] = useWorker();
    const { creationDateBefore, creationDateAfter } = useCreationDate();
    const { startDateBefore, startDateAfter } = useStartDate();
    const { endDateBefore, endDateAfter } = useEndDate();
    const setLocationPreserveParams = useSetLocationPreserveParams();

    const loading = useAppSelector(
        (state) => state.computePlans.computePlanTrainTasksLoading
    );
    const list = useCallback(
        () =>
            retrieveComputePlanTrainTasks({
                computePlanKey,
                page,
                ordering,
                match,
                status,
                worker,
                creation_date_after: creationDateAfter,
                creation_date_before: creationDateBefore,
                start_date_after: startDateAfter,
                start_date_before: startDateBefore,
                end_date_after: endDateAfter,
                end_date_before: endDateBefore,
            }),
        [
            computePlanKey,
            creationDateAfter,
            creationDateBefore,
            endDateAfter,
            endDateBefore,
            match,
            ordering,
            page,
            startDateAfter,
            startDateBefore,
            status,
            worker,
        ]
    );
    const tasks = useAppSelector(
        (state) => state.computePlans.computePlanTrainTasks
    );
    const count = useAppSelector(
        (state) => state.computePlans.computePlanTrainTasksCount
    );
    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );

    const onRefresh = () => {
        dispatchWithAutoAbort(
            retrieveComputePlanTrainTasks({
                computePlanKey,
                page,
                ordering,
                match,
                status,
                worker,
                creation_date_after: creationDateAfter,
                creation_date_before: creationDateBefore,
                start_date_after: startDateAfter,
                start_date_before: startDateBefore,
                end_date_after: endDateAfter,
                end_date_before: endDateBefore,
            })
        );
    };

    return (
        <GenericTasks
            tasksLoading={loading}
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
                    tableProps={{ width: '100%' }}
                />
            }
            taskDrawer={
                <TaskDrawer
                    category={TaskCategory.train}
                    onClose={() =>
                        setLocationPreserveParams(
                            compileListPath(TaskCategory.train)
                        )
                    }
                    taskKey={taskKey}
                    setPageTitle={true}
                />
            }
            onRefresh={onRefresh}
        />
    );
};
const CompositeTasks = ({
    taskKey,
    computePlanKey,
    compileListPath,
    compileDetailsPath,
}: TasksProps): JSX.Element => {
    const dispatchWithAutoAbort = useDispatchWithAutoAbort();
    const [page] = usePage();
    const [match] = useMatch();
    const [ordering] = useOrdering('-rank');
    const [status] = useStatus();
    const [worker] = useWorker();
    const { creationDateBefore, creationDateAfter } = useCreationDate();
    const { startDateBefore, startDateAfter } = useStartDate();
    const { endDateBefore, endDateAfter } = useEndDate();
    const setLocationPreserveParams = useSetLocationPreserveParams();

    const loading = useAppSelector(
        (state) => state.computePlans.computePlanCompositeTasksLoading
    );
    const list = useCallback(
        () =>
            retrieveComputePlanCompositeTasks({
                computePlanKey,
                page,
                ordering,
                match,
                status,
                worker,
                creation_date_after: creationDateAfter,
                creation_date_before: creationDateBefore,
                start_date_after: startDateAfter,
                start_date_before: startDateBefore,
                end_date_after: endDateAfter,
                end_date_before: endDateBefore,
            }),
        [
            computePlanKey,
            creationDateAfter,
            creationDateBefore,
            endDateAfter,
            endDateBefore,
            match,
            ordering,
            page,
            startDateAfter,
            startDateBefore,
            status,
            worker,
        ]
    );
    const tasks = useAppSelector(
        (state) => state.computePlans.computePlanCompositeTasks
    );
    const count = useAppSelector(
        (state) => state.computePlans.computePlanCompositeTasksCount
    );
    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );

    const onRefresh = () => {
        dispatchWithAutoAbort(
            retrieveComputePlanCompositeTasks({
                computePlanKey,
                page,
                ordering,
                match,
                status,
                worker,
                creation_date_after: creationDateAfter,
                creation_date_before: creationDateBefore,
                start_date_after: startDateAfter,
                start_date_before: startDateBefore,
                end_date_after: endDateAfter,
                end_date_before: endDateBefore,
            })
        );
    };

    return (
        <GenericTasks
            tasksLoading={loading}
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
                    tableProps={{ width: '100%' }}
                />
            }
            taskDrawer={
                <TaskDrawer
                    category={TaskCategory.composite}
                    onClose={() =>
                        setLocationPreserveParams(
                            compileListPath(TaskCategory.composite)
                        )
                    }
                    taskKey={taskKey}
                    setPageTitle={true}
                />
            }
            onRefresh={onRefresh}
        />
    );
};
const AggregateTasks = ({
    taskKey,
    computePlanKey,
    compileListPath,
    compileDetailsPath,
}: TasksProps): JSX.Element => {
    const dispatchWithAutoAbort = useDispatchWithAutoAbort();
    const [page] = usePage();
    const [match] = useMatch();
    const [ordering] = useOrdering('-rank');
    const [status] = useStatus();
    const [worker] = useWorker();
    const { creationDateBefore, creationDateAfter } = useCreationDate();
    const { startDateBefore, startDateAfter } = useStartDate();
    const { endDateBefore, endDateAfter } = useEndDate();
    const setLocationPreserveParams = useSetLocationPreserveParams();

    const loading = useAppSelector(
        (state) => state.computePlans.computePlanAggregateTasksLoading
    );
    const list = useCallback(
        () =>
            retrieveComputePlanAggregateTasks({
                computePlanKey,
                page,
                ordering,
                match,
                status,
                worker,
                creation_date_after: creationDateAfter,
                creation_date_before: creationDateBefore,
                start_date_after: startDateAfter,
                start_date_before: startDateBefore,
                end_date_after: endDateAfter,
                end_date_before: endDateBefore,
            }),
        [
            computePlanKey,
            creationDateAfter,
            creationDateBefore,
            endDateAfter,
            endDateBefore,
            match,
            ordering,
            page,
            startDateAfter,
            startDateBefore,
            status,
            worker,
        ]
    );
    const tasks = useAppSelector(
        (state) => state.computePlans.computePlanAggregateTasks
    );
    const count = useAppSelector(
        (state) => state.computePlans.computePlanAggregateTasksCount
    );
    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );

    const onRefresh = () => {
        dispatchWithAutoAbort(
            retrieveComputePlanAggregateTasks({
                computePlanKey,
                page,
                ordering,
                match,
                status,
                worker,
                creation_date_after: creationDateAfter,
                creation_date_before: creationDateBefore,
                start_date_after: startDateAfter,
                start_date_before: startDateBefore,
                end_date_after: endDateAfter,
                end_date_before: endDateBefore,
            })
        );
    };

    return (
        <GenericTasks
            tasksLoading={loading}
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
                    tableProps={{ width: '100%' }}
                />
            }
            taskDrawer={
                <TaskDrawer
                    category={TaskCategory.aggregate}
                    onClose={() =>
                        setLocationPreserveParams(
                            compileListPath(TaskCategory.aggregate)
                        )
                    }
                    taskKey={taskKey}
                    setPageTitle={true}
                />
            }
            onRefresh={onRefresh}
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
