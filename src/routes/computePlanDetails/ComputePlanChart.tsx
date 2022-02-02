import { useEffect } from 'react';

import Breadcrumbs from './components/BreadCrumbs';
import TabsNav from './components/TabsNav';
import { Box, Flex } from '@chakra-ui/react';
import { useLocation } from 'wouter';

import { retrieveComputePlan } from '@/modules/computePlans/ComputePlansSlice';
import { ComputePlanStatus } from '@/modules/computePlans/ComputePlansTypes';
import { loadSeries } from '@/modules/series/SeriesSlice';
import { TaskCategory } from '@/modules/tasks/TuplesTypes';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';

import { compilePath, PATHS, TASK_CATEGORY_SLUGS } from '@/routes';

import PerfBrowser from '@/components/PerfBrowser';
import PerfSidebarSectionNodes from '@/components/PerfSidebarSectionNodes';
import PerfSidebarSettingsAverage from '@/components/PerfSidebarSettingsAverage';

declare const MELLODDY: boolean;

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
    }, [computePlan?.status]);

    const dispatch = useAppDispatch();
    useEffect(() => {
        if (key) {
            dispatch(loadSeries(key));
        }
        if (key && key !== computePlan?.key) {
            dispatch(retrieveComputePlan(key));
        }
    }, [key]);

    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle(`Compute plan ${key}`),
        []
    );

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
                borderBottom="1px solid var(--chakra-colors-gray-100)"
            >
                <Breadcrumbs />
                <TabsNav />
            </Box>
            <PerfBrowser
                series={series}
                loading={loading}
                computePlans={computePlan ? [computePlan] : []}
                settingsComponents={
                    MELLODDY ? [] : [PerfSidebarSettingsAverage]
                }
                sectionComponents={[PerfSidebarSectionNodes]}
                colorMode="node"
            />
        </Flex>
    );
};

export default ComputePlanChart;
