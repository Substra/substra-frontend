import { useEffect, useMemo } from 'react';

import { useLocation } from 'wouter';

import { Box, Flex, HStack } from '@chakra-ui/react';

import useAppSelector from '@/hooks/useAppSelector';
import useDispatchWithAutoAbort from '@/hooks/useDispatchWithAutoAbort';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import usePerfBrowser, { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import { retrieveComputePlan } from '@/modules/computePlans/ComputePlansSlice';
import { ComputePlanStatus } from '@/modules/computePlans/ComputePlansTypes';
import { loadSeries } from '@/modules/series/SeriesSlice';
import { TaskCategory, TASK_CATEGORY_SLUGS } from '@/modules/tasks/TuplesTypes';
import { compilePath, PATHS } from '@/paths';

import MetadataModal from '@/components/MetadataModal';
import PerfBrowser from '@/components/PerfBrowser';
import PerfSidebarLines from '@/components/PerfSidebarLines';

import Actions from './components/Actions';
import ChartBreadcrumbs from './components/ChartBreadCrumbs';
import TabsNav from './components/TabsNav';

const ComputePlanChart = (): JSX.Element => {
    const key = useKeyFromPath(PATHS.COMPUTE_PLAN_CHART);

    const series = useAppSelector((state) => state.series.series);
    const loading = useAppSelector((state) => state.series.loading);
    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );
    const [, setLocation] = useLocation();

    useEffect(() => {
        if (
            computePlan?.status === ComputePlanStatus.todo ||
            computePlan?.status === ComputePlanStatus.waiting
        ) {
            const url = compilePath(PATHS.COMPUTE_PLAN_TASKS, {
                key: computePlan?.key,
                category: TASK_CATEGORY_SLUGS[TaskCategory.test],
            });
            setLocation(url);
        }
    }, [computePlan?.key, computePlan?.status, setLocation]);

    const dispatchWithAutoAbortSeries = useDispatchWithAutoAbort();
    const dispatchWithAutoAbortComputePlan = useDispatchWithAutoAbort();

    useEffect(() => {
        const destructors: (() => void)[] = [];
        if (key) {
            destructors.push(dispatchWithAutoAbortSeries(loadSeries(key)));
        }
        if (key && key !== computePlan?.key) {
            destructors.push(
                dispatchWithAutoAbortComputePlan(retrieveComputePlan(key))
            );
        }
        return () => {
            for (const destructor of destructors) {
                destructor();
            }
        };
    }, [
        key,
        computePlan?.key,
        dispatchWithAutoAbortComputePlan,
        dispatchWithAutoAbortSeries,
    ]);

    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle(`Compute plan ${key}`),
        []
    );

    const computePlans = useMemo(
        () => (computePlan ? [computePlan] : []),
        [computePlan]
    );
    const { context } = usePerfBrowser(
        series,
        computePlans,
        'organization',
        loading
    );

    return (
        <PerfBrowserContext.Provider value={context}>
            <Flex
                direction="column"
                alignItems="stretch"
                flexGrow={1}
                overflow="hidden"
                alignSelf="stretch"
            >
                <Box
                    background="white"
                    borderBottom="1px solid var(--chakra-colors-gray-100)"
                >
                    <HStack justifyContent="space-between">
                        <ChartBreadcrumbs />
                        <Actions
                            computePlan={computePlan}
                            loading={loading}
                            metadataModal={
                                <MetadataModal
                                    computePlans={
                                        computePlan ? [computePlan] : []
                                    }
                                />
                            }
                        />
                    </HStack>
                    <TabsNav />
                </Box>
                <PerfBrowser SidebarComponent={PerfSidebarLines} />
            </Flex>
        </PerfBrowserContext.Provider>
    );
};

export default ComputePlanChart;
