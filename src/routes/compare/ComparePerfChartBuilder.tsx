import { Fragment } from 'react';

import styled from '@emotion/styled';

import { SerieT } from '@/modules/series/SeriesTypes';
import { groupSeriesByMetric } from '@/modules/series/SeriesUtils';

import useAppSelector from '@/hooks/useAppSelector';

import BasePerfChart from '@/components/BasePerfChart';
import LoadingState from '@/components/LoadingState';
import PerformanceCard from '@/components/PerformanceCard';

import { Spaces } from '@/assets/theme';

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: ${Spaces.extraLarge} 0 ${Spaces.small} 0;
`;
interface ComparePerfChartBuilderProps {
    selectedComputePlanKeys: string[];
    selectedNodeKeys: string[];
}

const ComparePerfChartBuilder = ({
    selectedComputePlanKeys,
    selectedNodeKeys,
}: ComparePerfChartBuilderProps): JSX.Element => {
    const loading = useAppSelector((state) => state.series.loading);
    const series = useAppSelector((state) => state.series.computePlansSeries);

    const seriesGroups: SerieT[][] = groupSeriesByMetric(
        series,
        selectedComputePlanKeys,
        selectedNodeKeys
    );

    if (loading) {
        return <LoadingState message="Loading compute plans data..." />;
    } else if (seriesGroups.length === 0) {
        return (
            <p>
                There is no data to display: select at least one compute plan
                and one node.
            </p>
        );
    } else {
        return (
            <Fragment>
                {seriesGroups.map((series) => (
                    <PerformanceCard
                        title={series[0]?.metricName}
                        key={series.map((serie) => serie.id).join('-')}
                    >
                        <Container>
                            <BasePerfChart
                                series={series}
                                getSerieLabel={(serie) => serie.computePlanKey}
                                key={series.map((serie) => serie.id).join('-')}
                            />
                        </Container>
                    </PerformanceCard>
                ))}
            </Fragment>
        );
    }
};

export default ComparePerfChartBuilder;
