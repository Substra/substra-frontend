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
    retrieveComputePlanTasks,
} from '@/modules/computePlans/ComputePlansSlice';
import { PATHS } from '@/paths';
import { ROUTES } from '@/routes';
import TaskDrawer from '@/routes/tasks/components/TaskDrawer';

import TasksTable from '@/components/TasksTable';

import NotFound from '../notfound/NotFound';
import Actions from './components/Actions';
import DetailsSidebar from './components/DetailsSidebar';
import TabsNav from './components/TabsNav';
import TasksBreadcrumbs from './components/TasksBreadCrumbs';

const Tasks = ({ computePlanKey }: { computePlanKey: string }): JSX.Element => {
    const dispatchWithAutoAbort = useDispatchWithAutoAbort();
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

    const [, params] = useRoute(ROUTES.COMPUTE_PLAN_TASKS.path);
    const taskKey = params?.taskKey;

    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );
    const cpLoading = useAppSelector(
        (state) => state.computePlans.computePlanLoading
    );
    const tasks = useAppSelector(
        (state) => state.computePlans.computePlanTasks
    );
    const count = useAppSelector(
        (state) => state.computePlans.computePlanTasksCount
    );
    const tasksLoading = useAppSelector(
        (state) => state.computePlans.computePlanTasksLoading
    );

    const list = useCallback(
        () =>
            retrieveComputePlanTasks({
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

    useAssetListDocumentTitleEffect(
        `Compute plan ${computePlanKey}`,
        params?.taskKey || null
    );

    useEffect(() => {
        if (computePlanKey && computePlanKey !== computePlan?.key) {
            return dispatchWithAutoAbort(retrieveComputePlan(computePlanKey));
        }
    }, [computePlanKey, computePlan?.key, dispatchWithAutoAbort]);

    return (
        <Flex direction="column" alignItems="stretch" flexGrow={1}>
            <TaskDrawer
                onClose={() =>
                    setLocationPreserveParams(PATHS.COMPUTE_PLAN_TASKS)
                }
                taskKey={taskKey}
                setPageTitle={true}
            />
            <Box
                background="white"
                borderBottomColor="gray.100"
                borderBottomStyle="solid"
                borderBottomWidth="1px"
            >
                <HStack justifyContent="space-between">
                    <TasksBreadcrumbs />
                    <Actions computePlan={computePlan} loading={cpLoading} />
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
                    <TasksTable
                        loading={tasksLoading}
                        list={list}
                        tasks={tasks}
                        count={count}
                        computePlan={computePlan}
                        tableProps={{ width: '100%' }}
                    />
                </VStack>
                <DetailsSidebar />
            </HStack>
        </Flex>
    );
};

const ComputePlanTasks = (): JSX.Element => {
    const [, params] = useRoute(ROUTES.COMPUTE_PLAN_TASKS.path);
    const computePlanKey = params?.key;

    if (!computePlanKey) {
        return <NotFound />;
    }

    return <Tasks computePlanKey={computePlanKey} />;
};

export default ComputePlanTasks;
