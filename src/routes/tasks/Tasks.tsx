import TaskDrawer from './components/TaskDrawer';
import { VStack, Box } from '@chakra-ui/react';

import {
    listAggregateTasks,
    listCompositeTasks,
    listTestTasks,
    listTrainTasks,
} from '@/modules/tasks/TasksSlice';

import { useAppSelector } from '@/hooks';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useLocationWithParams from '@/hooks/useLocationWithParams';

import { compilePath, PATHS } from '@/routes';

import TableTitle from '@/components/TableTitle';
import TasksTable, { selectedTaskT } from '@/components/TasksTable';

const Tasks = (): JSX.Element => {
    const {
        params: { search: searchFilters, page },
        setLocationWithParams,
    } = useLocationWithParams();

    const taskTypes: selectedTaskT[] = [
        {
            id: 0,
            name: 'Train',
            slug: 'traintuple',
            loading: useAppSelector((state) => state.tasks.trainTasksLoading),
            list: () => listTrainTasks({ filters: searchFilters, page }),
            tasks: useAppSelector((state) => state.tasks.trainTasks),
            count: useAppSelector((state) => state.tasks.trainTasksCount),
        },
        {
            id: 1,
            name: 'Test',
            slug: 'testtuple',
            loading: useAppSelector((state) => state.tasks.testTasksLoading),
            list: () => listTestTasks({ filters: searchFilters, page }),
            tasks: useAppSelector((state) => state.tasks.testTasks),
            count: useAppSelector((state) => state.tasks.testTasksCount),
        },
        {
            id: 2,
            name: 'Composite train',
            slug: 'composite_traintuple',
            loading: useAppSelector(
                (state) => state.tasks.compositeTasksLoading
            ),
            list: () => listCompositeTasks({ filters: searchFilters, page }),
            tasks: useAppSelector((state) => state.tasks.compositeTasks),
            count: useAppSelector((state) => state.tasks.compositeTasksCount),
        },
        {
            id: 3,
            name: 'Aggregate',
            slug: 'aggregatetuple',
            loading: useAppSelector(
                (state) => state.tasks.aggregateTasksLoading
            ),
            list: () => listAggregateTasks({ filters: searchFilters, page }),
            tasks: useAppSelector((state) => state.tasks.aggregateTasks),
            count: useAppSelector((state) => state.tasks.aggregateTasksCount),
        },
    ];

    const key = useKeyFromPath(PATHS.TASK);

    useAssetListDocumentTitleEffect('Tasks list', key);

    return (
        <Box padding="6" marginLeft="auto" marginRight="auto">
            <TaskDrawer />
            <VStack marginBottom="2.5" spacing="2.5" alignItems="flex-start">
                <TableTitle title="Tasks" />
                <TasksTable
                    taskTypes={taskTypes}
                    onTrClick={(taskKey) => () =>
                        setLocationWithParams(
                            compilePath(PATHS.TASK, {
                                key: taskKey,
                            })
                        )}
                />
            </VStack>
        </Box>
    );
};

export default Tasks;
