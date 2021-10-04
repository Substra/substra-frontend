import Container from './components/Container';
import Header from './components/Header';
import PerfChartBuilder from './components/PerfChartBuilder';
import TabsNav from './components/TabsNav';

import { useAppSelector } from '@/hooks';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useKeyFromPath from '@/hooks/useKeyFromPath';

import { PATHS } from '@/routes';

import PageLayout from '@/components/layout/PageLayout';

const ComputePlanChart = (): JSX.Element => {
    const key = useKeyFromPath(PATHS.COMPUTE_PLAN_CHART);

    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle(`${key} (compute plan)`),
        []
    );

    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );

    return (
        <PageLayout siderVisible={false}>
            <Container>
                <Header />
                <TabsNav />
                {computePlan && <PerfChartBuilder computePlan={computePlan} />}
            </Container>
        </PageLayout>
    );
};

export default ComputePlanChart;
