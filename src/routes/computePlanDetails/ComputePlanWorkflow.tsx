import { useEffect } from 'react';

import { useRoute } from 'wouter';

import { Box, Flex, HStack, Text } from '@chakra-ui/react';

import useAppSelector from '@/hooks/useAppSelector';
import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import {
    useAssetListDocumentTitleEffect,
    useDocumentTitleEffect,
} from '@/hooks/useDocumentTitleEffect';
import { retrieveComputePlan } from '@/modules/computePlans/ComputePlansSlice';
import { retrieveCPWorkflowGraph } from '@/modules/cpWorkflow/CPWorkflowSlice';
import { PATHS } from '@/paths';
import NotFound from '@/routes/notfound/NotFound';

import Actions from './components/Actions';
import TabsNav from './components/TabsNav';
import TasksBreadcrumbs from './components/TasksBreadCrumbs';
import TasksWorkflow from './components/TasksWorkflow';
import UnavailableWorkflow from './components/UnavailableWorkflow';

const ComputePlanWorkflow = (): JSX.Element => {
    const graphLoading = useAppSelector((state) => state.cpWorkflow.loading);
    const graphError = useAppSelector((state) => state.cpWorkflow.error);
    const graphTasks = useAppSelector((state) => state.cpWorkflow.graph.tasks);
    const [, params] = useRoute(PATHS.COMPUTE_PLAN_WORKFLOW);
    const key = params?.key;

    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle(`Compute plan ${key}`),
        []
    );

    useAssetListDocumentTitleEffect(`Compute plan ${key}`, params?.key || null);

    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );
    const computePlanLoading = useAppSelector(
        (state) => state.computePlans.computePlanLoading
    );

    const dispatchWithAutoAbortComputePlan = useDispatchWithAutoAbort();
    useEffect(() => {
        if (key && key !== computePlan?.key) {
            return dispatchWithAutoAbortComputePlan(retrieveComputePlan(key));
        }
    }, [key, computePlan?.key, dispatchWithAutoAbortComputePlan]);

    const dispatchWithAutoAbortWorkflow = useDispatchWithAutoAbort();
    useEffect(() => {
        if (key) {
            return dispatchWithAutoAbortWorkflow(retrieveCPWorkflowGraph(key));
        }
    }, [key, dispatchWithAutoAbortWorkflow]);

    if (!key) {
        return <NotFound />;
    }

    const isReady = computePlan && !graphLoading;

    return (
        <Flex
            direction="column"
            alignItems="stretch"
            flexGrow={1}
            overflow="hidden"
            alignSelf="stretch"
        >
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
                        loading={computePlanLoading}
                    />
                </HStack>
                <TabsNav />
            </Box>
            {!isReady && <Text padding="6">Loading</Text>}
            {isReady && (graphTasks.length === 0 || graphError) && (
                <Flex justifyContent="center" alignItems="center" flexGrow={1}>
                    <UnavailableWorkflow
                        subtitle={graphError || 'The compute plan is empty'}
                    />
                </Flex>
            )}
            {isReady && !graphError && graphTasks.length > 0 && (
                <TasksWorkflow />
            )}
        </Flex>
    );
};

export default ComputePlanWorkflow;
