import { useCallback } from 'react';

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
import { listTasks } from '@/modules/tasks/TasksSlice';
import { PATHS } from '@/paths';

import TableTitle from '@/components/TableTitle';
import TasksTable from '@/components/TasksTable';

import TaskDrawer from './components/TaskDrawer';

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

    const taskKey = useKeyFromPath(PATHS.TASK);
    useAssetListDocumentTitleEffect('Tasks list', taskKey);

    const tasks = useAppSelector((state) => state.tasks.tasks);
    const count = useAppSelector((state) => state.tasks.tasksCount);
    const loading = useAppSelector((state) => state.tasks.tasksLoading);

    const list = useCallback(
        () =>
            listTasks({
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
                loading={loading}
                list={list}
                tasks={tasks}
                count={count}
            />
        </VStack>
    );
};

export default Tasks;
