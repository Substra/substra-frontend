import { useEffect, useMemo } from 'react';

import { useLocation } from 'wouter';

import { Box, Flex, HStack } from '@chakra-ui/react';

import useSeriesStore from '@/features/series/useSeriesStore';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import usePerfBrowser, { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import { compilePath, PATHS } from '@/paths';
import { ComputePlanStatus } from '@/types/ComputePlansTypes';

import MetadataModal from '@/components/MetadataModal';
import PerfBrowser from '@/components/PerfBrowser';
import PerfSidebarLines from '@/components/PerfSidebarLines';

import Actions from '../components/Actions';
import TabsNav from '../components/TabsNav';
import useComputePlanStore from '../useComputePlanStore';
import ChartBreadcrumbs from './components/ChartBreadCrumbs';

const ComputePlanChart = (): JSX.Element => {
    const key = useKeyFromPath(PATHS.COMPUTE_PLAN_CHART);

    const { series, fetchingSeries, fetchSeries } = useSeriesStore();
    const { computePlan, fetchComputePlan } = useComputePlanStore();
    const [, setLocation] = useLocation();

    useEffect(() => {
        if (
            computePlan?.status === ComputePlanStatus.todo ||
            computePlan?.status === ComputePlanStatus.waiting
        ) {
            const url = compilePath(PATHS.COMPUTE_PLAN_TASKS, {
                key: computePlan?.key,
            });
            setLocation(url);
        }
    }, [computePlan?.key, computePlan?.status, setLocation]);

    useEffect(() => {
        if (key) {
            fetchSeries(key);
        }
        if (key && key !== computePlan?.key) {
            fetchComputePlan(key);
        }
    }, [key, computePlan?.key, fetchComputePlan, fetchSeries]);

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
        fetchingSeries
    );

    return (
        <PerfBrowserContext.Provider value={context}>
            <Flex
                data-cy="cp-chart"
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
                            loading={fetchingSeries}
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
