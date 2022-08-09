import { useCallback, useEffect } from 'react';

import { useRoute } from 'wouter';

import { Box, Flex, Heading, HStack, VStack } from '@chakra-ui/react';

import useAppSelector from '@/hooks/useAppSelector';
import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import { useSetLocationPreserveParams } from '@/hooks/useLocationWithParams';
import {
    useCreationDate,
    useDuration,
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
    retrieveComputePlanPredictTasks,
    retrieveComputePlanTestTasks,
    retrieveComputePlanTrainTasks,
} from '@/modules/computePlans/ComputePlansSlice';
import { TaskCategory, TASK_CATEGORY_SLUGS } from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS } from '@/paths';
import NotFound from '@/routes/notfound/NotFound';
import TaskDrawer from '@/routes/tasks/components/TaskDrawer';

import TasksTable from '@/components/TasksTable';

import Actions from './components/Actions';
import DetailsSidebar from './components/DetailsSidebar';
import TabsNav from './components/TabsNav';
import TasksBreadcrumbs from './components/TasksBreadCrumbs';

type GenericTasksProps = {
    tasksTable: React.ReactNode;
    taskDrawer: React.ReactNode;
};
const GenericTasks = ({
    tasksTable,
    taskDrawer,
}: GenericTasksProps): JSX.Element => {
    const [, params] = useRoute(PATHS.COMPUTE_PLAN_TASKS);
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

type TasksProps = {
    computePlanKey: string;
    taskKey: string | undefined;
    compileListPath: (category: TaskCategory) => string;
    compileDetailsPath: (category: TaskCategory, taskKey: string) => string;
};

const TestTasks = ({
    taskKey,
    computePlanKey,
    compileListPath,
    compileDetailsPath,
}: TasksProps): JSX.Element => {
    const [page] = usePage();
    const [match] = useMatch();
    const [ordering] = useOrdering('-rank');
    const [status] = useStatus();
    const [worker] = useWorker();
    const { creationDateBefore, creationDateAfter } = useCreationDate();
    const { startDateBefore, startDateAfter } = useStartDate();
    const { endDateBefore, endDateAfter } = useEndDate();
    const { durationMin, durationMax } = useDuration();
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
                duration_min: durationMin,
                duration_max: durationMax,
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
            durationMin,
            durationMax,
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
        />
    );
};

const TrainTasks = ({
    taskKey,
    computePlanKey,
    compileListPath,
    compileDetailsPath,
}: TasksProps): JSX.Element => {
    const [page] = usePage();
    const [match] = useMatch();
    const [ordering] = useOrdering('-rank');
    const [status] = useStatus();
    const [worker] = useWorker();
    const { creationDateBefore, creationDateAfter } = useCreationDate();
    const { startDateBefore, startDateAfter } = useStartDate();
    const { endDateBefore, endDateAfter } = useEndDate();
    const { durationMin, durationMax } = useDuration();
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
                duration_min: durationMin,
                duration_max: durationMax,
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
            durationMin,
            durationMax,
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
        />
    );
};
const CompositeTasks = ({
    taskKey,
    computePlanKey,
    compileListPath,
    compileDetailsPath,
}: TasksProps): JSX.Element => {
    const [page] = usePage();
    const [match] = useMatch();
    const [ordering] = useOrdering('-rank');
    const [status] = useStatus();
    const [worker] = useWorker();
    const { creationDateBefore, creationDateAfter } = useCreationDate();
    const { startDateBefore, startDateAfter } = useStartDate();
    const { endDateBefore, endDateAfter } = useEndDate();
    const { durationMin, durationMax } = useDuration();
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
                duration_min: durationMin,
                duration_max: durationMax,
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
            durationMin,
            durationMax,
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
        />
    );
};
const AggregateTasks = ({
    taskKey,
    computePlanKey,
    compileListPath,
    compileDetailsPath,
}: TasksProps): JSX.Element => {
    const [page] = usePage();
    const [match] = useMatch();
    const [ordering] = useOrdering('-rank');
    const [status] = useStatus();
    const [worker] = useWorker();
    const { creationDateBefore, creationDateAfter } = useCreationDate();
    const { startDateBefore, startDateAfter } = useStartDate();
    const { endDateBefore, endDateAfter } = useEndDate();
    const { durationMin, durationMax } = useDuration();
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
                duration_min: durationMin,
                duration_max: durationMax,
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
            durationMin,
            durationMax,
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
        />
    );
};

const PredictTasks = ({
    taskKey,
    computePlanKey,
    compileListPath,
    compileDetailsPath,
}: TasksProps): JSX.Element => {
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
        (state) => state.computePlans.computePlanPredictTasksLoading
    );
    const list = useCallback(
        () =>
            retrieveComputePlanPredictTasks({
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
        (state) => state.computePlans.computePlanPredictTasks
    );
    const count = useAppSelector(
        (state) => state.computePlans.computePlanPredictTasksCount
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
                    category={TaskCategory.predict}
                    compileListPath={compileListPath}
                    compileDetailsPath={compileDetailsPath}
                    computePlan={computePlan}
                    tableProps={{ width: '100%' }}
                />
            }
            taskDrawer={
                <TaskDrawer
                    category={TaskCategory.predict}
                    onClose={() =>
                        setLocationPreserveParams(
                            compileListPath(TaskCategory.predict)
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
    const [, params] = useRoute(PATHS.COMPUTE_PLAN_TASKS);
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
    } else if (params?.category === 'predict') {
        return (
            <PredictTasks
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
