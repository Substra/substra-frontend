import { useRoute } from 'wouter';

import { VStack } from '@chakra-ui/react';

import useAppSelector from '@/hooks/useAppSelector';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useLocationWithParams from '@/hooks/useLocationWithParams';
import { useSyncedStringState } from '@/hooks/useSyncedState';
import {
    listAggregateTasks,
    listCompositeTasks,
    listTestTasks,
    listTrainTasks,
} from '@/modules/tasks/TasksSlice';
import { TaskCategory } from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS, ROUTES, TASK_CATEGORY_SLUGS } from '@/routes';
import NotFound from '@/routes/notfound/NotFound';

import TableTitle from '@/components/TableTitle';
import TasksTable from '@/components/TasksTable';

import TaskDrawer from './components/TaskDrawer';

interface GenericTasksProps {
    tasksTable: React.ReactNode;
    taskDrawer: React.ReactNode;
}
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

interface TasksProps {
    taskKey: string | undefined;
}

const TestTasks = ({ taskKey }: TasksProps): JSX.Element => {
    const {
        params: { search: searchFilters, page },
        setLocationWithParams,
    } = useLocationWithParams();
    const [ordering] = useSyncedStringState('ordering', '-rank');

    const loading = useAppSelector((state) => state.tasks.testTasksLoading);
    const list = () =>
        listTestTasks({ filters: searchFilters, page, ordering });
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

const TrainTasks = ({ taskKey }: TasksProps): JSX.Element => {
    const {
        params: { search: searchFilters, page },
        setLocationWithParams,
    } = useLocationWithParams();
    const [ordering] = useSyncedStringState('ordering', '-rank');

    const loading = useAppSelector((state) => state.tasks.trainTasksLoading);
    const list = () =>
        listTrainTasks({ filters: searchFilters, page, ordering });
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

const CompositeTrainTasks = ({ taskKey }: TasksProps): JSX.Element => {
    const {
        params: { search: searchFilters, page },
        setLocationWithParams,
    } = useLocationWithParams();
    const [ordering] = useSyncedStringState('ordering', '-rank');

    const loading = useAppSelector(
        (state) => state.tasks.compositeTasksLoading
    );
    const list = () =>
        listCompositeTasks({ filters: searchFilters, page, ordering });
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

const AggregateTasks = ({ taskKey }: TasksProps): JSX.Element => {
    const {
        params: { search: searchFilters, page },
        setLocationWithParams,
    } = useLocationWithParams();
    const [ordering] = useSyncedStringState('ordering', '-rank');

    const loading = useAppSelector(
        (state) => state.tasks.aggregateTasksLoading
    );
    const list = () =>
        listAggregateTasks({ filters: searchFilters, page, ordering });
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

const Tasks = () => {
    const [, params] = useRoute(ROUTES.TASKS.path);

    if (params?.category === 'test') {
        return <TestTasks taskKey={params?.key} />;
    } else if (params?.category === 'train') {
        return <TrainTasks taskKey={params?.key} />;
    } else if (params?.category === 'composite_train') {
        return <CompositeTrainTasks taskKey={params?.key} />;
    } else if (params?.category === 'aggregate') {
        return <AggregateTasks taskKey={params?.key} />;
    } else {
        return <NotFound />;
    }
};

export default Tasks;
