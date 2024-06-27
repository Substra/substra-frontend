import { useCallback } from 'react';

import { useParams } from 'wouter';

import { VStack } from '@chakra-ui/react';

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
import { endOfDay } from '@/libs/utils';
import { PATHS } from '@/paths';

import TableTitle from '@/components/table/TableTitle';
import TasksTable from '@/components/table/TasksTable';

import TaskDrawer from './components/TaskDrawer';
import useTasksStore from './useTasksStore';

const Tasks = (): JSX.Element => {
    const setLocationPreserveParams = useSetLocationPreserveParams();

    const [page] = usePage();
    const [match] = useMatch();
    const [ordering] = useOrdering('-rank');
    const [status] = useStatus();
    const [worker] = useWorker();
    const { creationDateBefore, creationDateAfter } = useCreationDate();
    const { startDateBefore, startDateAfter } = useStartDate();
    const { endDateBefore, endDateAfter } = useEndDate();
    const { durationMin, durationMax } = useDuration();

    const { key: taskKey } = useParams();
    useAssetListDocumentTitleEffect('Tasks list', taskKey || null);

    const { tasks, tasksCount, fetchingTasks, fetchTasks } = useTasksStore();

    const list = useCallback(
        () =>
            fetchTasks({
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
            fetchTasks,
        ]
    );

    return (
        <VStack
            paddingX="6"
            paddingY="8"
            marginX="auto"
            spacing="2.5"
            alignItems="flex-start"
        >
            <TaskDrawer
                onClose={() => setLocationPreserveParams(PATHS.TASKS)}
                taskKey={taskKey}
                setPageTitle={true}
            />
            <TableTitle title="Tasks" />
            <TasksTable
                loading={fetchingTasks}
                list={list}
                tasks={tasks}
                count={tasksCount}
            />
        </VStack>
    );
};

export default Tasks;
