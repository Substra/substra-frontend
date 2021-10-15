import { useEffect } from 'react';

import Breadcrumbs from './components/BreadCrumbs';
import PerfChartBuilder from './components/PerfChartBuilder';
import TabsNav from './components/TabsNav';
import { Box, Flex } from '@chakra-ui/react';

import { retrieveComputePlan } from '@/modules/computePlans/ComputePlansSlice';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';

import { PATHS } from '@/routes';

const ComputePlanChart = (): JSX.Element => {
    const key = useKeyFromPath(PATHS.COMPUTE_PLAN_CHART);

    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle(`${key} (compute plan)`),
        []
    );

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (key && computePlan?.key !== key) {
            dispatch(retrieveComputePlan(key));
        }
    }, [key]);

    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );

    return (
        <Flex direction="column" alignItems="stretch" flexGrow={1}>
            <Box background="white">
                <Breadcrumbs />
                <TabsNav />
            </Box>
            <Box
                paddingLeft="8"
                paddingRight="8"
                paddingTop="6"
                paddingBottom="6"
            >
                {computePlan && <PerfChartBuilder computePlan={computePlan} />}
            </Box>
        </Flex>
    );
};

export default ComputePlanChart;
