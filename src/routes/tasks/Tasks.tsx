import { useCallback } from 'react';

import { useRoute } from 'wouter';

import { VStack } from '@chakra-ui/react';

import useAppSelector from '@/hooks/useAppSelector';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
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
import { endOfDay } from '@/libs/utils';
import {
    listAggregateTasks,
    listCompositeTasks,
    listPredictTasks,
    listTestTasks,
    listTrainTasks,
} from '@/modules/tasks/TasksSlice';
import { TaskCategory, TASK_CATEGORY_SLUGS } from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS } from '@/paths';
import NotFound from '@/routes/notfound/NotFound';

import TableTitle from '@/components/TableTitle';
import TasksTable from '@/components/TasksTable';

import TaskDrawer from './components/TaskDrawer';

type GenericTasksProps = {
    tasksTable: React.ReactNode;
    taskDrawer: React.ReactNode;
};
const GenericTasks = ({
    tasksTable,
    taskDrawer,
}: GenericTasksProps): JSX.Element => {
    const key = useKeyFromPath(PATHS.TASK);

    useAssetListDocumentTitleEffect('Tasks list', key);

    return (
        <VStack
            paddingX="6"
            paddingY="8"
            marginX="auto"
            spacing="2.5"
            alignItems="flex-start"
        >
            {taskDrawer}
            <TableTitle title="Tasks" />
            {tasksTable}
        </VStack>
    );
};

const compileListPath = (category: TaskCategory): string => {
    return compilePath(PATHS.TASKS, {
        category: TASK_CATEGORY_SLUGS[category],
    });
};

const compileDetailsPath = (category: TaskCategory, key: string): string => {
    return compilePath(PATHS.TASK, {
        category: TASK_CATEGORY_SLUGS[category],
        key,
    });
};

type TasksProps = {
    taskKey: string | undefined;
};

const TestTasks = ({ taskKey }: TasksProps): JSX.Element => {
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

    const loading = useAppSelector((state) => state.tasks.testTasksLoading);
    const list = useCallback(
        () =>
            listTestTasks({
                page,
                ordering,
                match,
                status,
                worker,
                creation_date_after: creationDateAfter,
                creation_date_before: endOfDay(creationDateBefore),
                start_date_after: startDateAfter,
                start_date_before: endOfDay(startDateBefore),
                end_date_after: endDateAfter,
                end_date_before: endOfDay(endDateBefore),
                duration_min: durationMin,
                duration_max: durationMax,
            }),
        [
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
    const tasks = useAppSelector((state) => state.tasks.testTasks);
    const count = useAppSelector((state) => state.tasks.testTasksCount);

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

const TrainTasks = ({ taskKey }: TasksProps): JSX.Element => {
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

    const loading = useAppSelector((state) => state.tasks.trainTasksLoading);
    const list = useCallback(
        () =>
            listTrainTasks({
                page,
                ordering,
                match,
                status,
                worker,
                creation_date_after: creationDateAfter,
                creation_date_before: endOfDay(creationDateBefore),
                start_date_after: startDateAfter,
                start_date_before: endOfDay(startDateBefore),
                end_date_after: endDateAfter,
                end_date_before: endOfDay(endDateBefore),
                duration_min: durationMin,
                duration_max: durationMax,
            }),
        [
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
    const tasks = useAppSelector((state) => state.tasks.trainTasks);
    const count = useAppSelector((state) => state.tasks.trainTasksCount);

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

const CompositeTrainTasks = ({ taskKey }: TasksProps): JSX.Element => {
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
        (state) => state.tasks.compositeTasksLoading
    );
    const list = useCallback(
        () =>
            listCompositeTasks({
                page,
                ordering,
                match,
                status,
                worker,
                creation_date_after: creationDateAfter,
                creation_date_before: endOfDay(creationDateBefore),
                start_date_after: startDateAfter,
                start_date_before: endOfDay(startDateBefore),
                end_date_after: endDateAfter,
                end_date_before: endOfDay(endDateBefore),
                duration_min: durationMin,
                duration_max: durationMax,
            }),
        [
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
    const tasks = useAppSelector((state) => state.tasks.compositeTasks);
    const count = useAppSelector((state) => state.tasks.compositeTasksCount);

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

const AggregateTasks = ({ taskKey }: TasksProps): JSX.Element => {
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
        (state) => state.tasks.aggregateTasksLoading
    );
    const list = useCallback(
        () =>
            listAggregateTasks({
                page,
                ordering,
                match,
                status,
                worker: worker,
                creation_date_after: creationDateAfter,
                creation_date_before: endOfDay(creationDateBefore),
                start_date_after: startDateAfter,
                start_date_before: endOfDay(startDateBefore),
                end_date_after: endDateAfter,
                end_date_before: endOfDay(endDateBefore),
                duration_min: durationMin,
                duration_max: durationMax,
            }),
        [
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
    const tasks = useAppSelector((state) => state.tasks.aggregateTasks);
    const count = useAppSelector((state) => state.tasks.aggregateTasksCount);

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

const PredictTasks = ({ taskKey }: TasksProps): JSX.Element => {
    const [page] = usePage();
    const [match] = useMatch();
    const [ordering] = useOrdering('-rank');
    const [status] = useStatus();
    const [worker] = useWorker();
    const { creationDateBefore, creationDateAfter } = useCreationDate();
    const { startDateBefore, startDateAfter } = useStartDate();
    const { endDateBefore, endDateAfter } = useEndDate();
    const setLocationPreserveParams = useSetLocationPreserveParams();

    const loading = useAppSelector((state) => state.tasks.predictTasksLoading);
    const list = useCallback(
        () =>
            listPredictTasks({
                page,
                ordering,
                match,
                status,
                worker: worker,
                creation_date_after: creationDateAfter,
                creation_date_before: endOfDay(creationDateBefore),
                start_date_after: startDateAfter,
                start_date_before: endOfDay(startDateBefore),
                end_date_after: endDateAfter,
                end_date_before: endOfDay(endDateBefore),
            }),
        [
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
    const tasks = useAppSelector((state) => state.tasks.predictTasks);
    const count = useAppSelector((state) => state.tasks.predictTasksCount);

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

const Tasks = () => {
    const [, params] = useRoute(PATHS.TASKS);

    if (params?.category === 'test') {
        return <TestTasks taskKey={params?.key} />;
    } else if (params?.category === 'train') {
        return <TrainTasks taskKey={params?.key} />;
    } else if (params?.category === 'composite_train') {
        return <CompositeTrainTasks taskKey={params?.key} />;
    } else if (params?.category === 'aggregate') {
        return <AggregateTasks taskKey={params?.key} />;
    } else if (params?.category === 'predict') {
        return <PredictTasks taskKey={params?.key} />;
    } else {
        return <NotFound />;
    }
};

export default Tasks;
