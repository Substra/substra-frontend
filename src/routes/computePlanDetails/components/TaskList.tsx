import { Heading, VStack } from '@chakra-ui/react';

import {
    retrieveComputePlanAggregateTasks,
    retrieveComputePlanCompositeTasks,
    retrieveComputePlanTestTasks,
    retrieveComputePlanTrainTasks,
} from '@/modules/computePlans/ComputePlansSlice';

import { useAppSelector } from '@/hooks';
import { useAssetListDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useLocationWithParams from '@/hooks/useLocationWithParams';

import { compilePath, PATHS } from '@/routes';

import TasksTable, { selectedTaskT } from '@/components/TasksTable';

const Tasks = (): JSX.Element => {
    const {
        params: { page, search: searchFilters },
        setLocationWithParams,
    } = useLocationWithParams();

    // the || '' at the end is just a way to make sure computePlanKey is always a string.
    const computePlanKey =
        useAppSelector((state) => state.computePlans.computePlan?.key) || '';

    const taskTypes: selectedTaskT[] = [
        {
            id: 0,
            name: 'Train',
            slug: 'traintuple',
            loading: useAppSelector(
                (state) => state.computePlans.computePlanTrainTasksLoading
            ),
            list: () => {
                if (!computePlanKey) {
                    return null;
                }
                return retrieveComputePlanTrainTasks({
                    computePlanKey,
                    page,
                    filters: searchFilters,
                });
            },
            tasks: useAppSelector(
                (state) => state.computePlans.computePlanTrainTasks
            ),
            count: useAppSelector(
                (state) => state.computePlans.computePlanTrainTasksCount
            ),
        },
        {
            id: 1,
            name: 'Test',
            slug: 'testtuple',
            loading: useAppSelector(
                (state) => state.computePlans.computePlanTestTasksLoading
            ),
            list: () => {
                if (!computePlanKey) {
                    return null;
                }
                return retrieveComputePlanTestTasks({
                    computePlanKey,
                    page,
                    filters: searchFilters,
                });
            },
            tasks: useAppSelector(
                (state) => state.computePlans.computePlanTestTasks
            ),
            count: useAppSelector(
                (state) => state.computePlans.computePlanTestTasksCount
            ),
        },
        {
            id: 2,
            name: 'Composite',
            slug: 'composite_traintuple',
            loading: useAppSelector(
                (state) => state.computePlans.computePlanCompositeTasksLoading
            ),
            list: () => {
                if (!computePlanKey) {
                    return null;
                }
                return retrieveComputePlanCompositeTasks({
                    computePlanKey,
                    page,
                    filters: searchFilters,
                });
            },
            tasks: useAppSelector(
                (state) => state.computePlans.computePlanCompositeTasks
            ),
            count: useAppSelector(
                (state) => state.computePlans.computePlanCompositeTasksCount
            ),
        },
        {
            id: 3,
            name: 'Aggregate',
            slug: 'aggregatetuple',
            loading: useAppSelector(
                (state) => state.computePlans.computePlanAggregateTasksLoading
            ),
            list: () => {
                if (!computePlanKey) {
                    return null;
                }
                return retrieveComputePlanAggregateTasks({
                    computePlanKey,
                    page,
                    filters: searchFilters,
                });
            },
            tasks: useAppSelector(
                (state) => state.computePlans.computePlanAggregateTasks
            ),
            count: useAppSelector(
                (state) => state.computePlans.computePlanAggregateTasksCount
            ),
        },
    ];

    const key = useKeyFromPath(PATHS.COMPUTE_PLAN_TASK, 'taskKey');

    useAssetListDocumentTitleEffect('Tasks list', key);

    return (
        <VStack display="inline-block" spacing="2.5">
            <Heading size="xxs" textTransform="uppercase">
                Tasks
            </Heading>
            <TasksTable
                taskTypes={taskTypes}
                onTrClick={(taskKey) => () =>
                    setLocationWithParams(
                        compilePath(PATHS.COMPUTE_PLAN_TASK, {
                            key: computePlanKey,
                            taskKey: taskKey,
                        })
                    )}
            />
        </VStack>
    );
};

export default Tasks;
