import { useEffect } from 'react';

import { useParams } from 'wouter';

import { Box, Flex, HStack, Text } from '@chakra-ui/react';

import {
    useAssetListDocumentTitleEffect,
    useDocumentTitleEffect,
} from '@/hooks/useDocumentTitleEffect';
import Actions from '@/routes/computePlanDetails/components/Actions';
import TabsNav from '@/routes/computePlanDetails/components/TabsNav';
import TasksBreadcrumbs from '@/routes/computePlanDetails/components/TasksBreadCrumbs';
import useComputePlanStore from '@/routes/computePlanDetails/useComputePlanStore';
import NotFound from '@/routes/notfound/NotFound';

import TasksWorkflow from './components/TasksWorkflow';
import UnavailableWorkflow from './components/UnavailableWorkflow';
import useWorkflowStore from './useWorkflowStore';

const ComputePlanWorkflow = (): JSX.Element => {
    const { key } = useParams();

    const {
        graph: { tasks: graphTasks },
        fetchingGraph,
        graphError,
        fetchGraph,
    } = useWorkflowStore();
    const { computePlan, fetchingComputePlan, fetchComputePlan } =
        useComputePlanStore();

    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle(`Compute plan ${key}`),
        []
    );

    useAssetListDocumentTitleEffect(`Compute plan ${key}`, key || null);

    useEffect(() => {
        if (key && key !== computePlan?.key) {
            fetchComputePlan(key);
        }
    }, [key, computePlan?.key, fetchComputePlan]);

    useEffect(() => {
        let abort;
        if (key) {
            abort = fetchGraph(key);
        }
        return abort;
    }, [key, fetchGraph]);

    if (!key) {
        return <NotFound />;
    }

    const isReady = computePlan && !fetchingGraph;

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
                        loading={fetchingComputePlan}
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
