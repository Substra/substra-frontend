import { useMemo, useEffect, useState } from 'react';

import { Wrap, WrapItem } from '@chakra-ui/react';

import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { loadSeries } from '@/modules/series/SeriesSlice';
import { SerieT } from '@/modules/series/SeriesTypes';
import { buildSeriesGroups } from '@/modules/series/SeriesUtils';

import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';

import LoadingState from '@/components/LoadingState';
import PerfChart from '@/components/PerfChart';
import PerfFullScreen from '@/components/PerfFullScreen';
import PerformanceCard from '@/components/PerformanceCard';

interface PerfChartBuilderProps {
    computePlan: ComputePlanT;
    displayAverage: boolean;
    selectedNodeKeys: string[];
}
const PerfChartBuilder = ({
    computePlan,
    displayAverage,
    selectedNodeKeys,
}: PerfChartBuilderProps): JSX.Element => {
    const dispatch = useAppDispatch();
    const [fullScreenMetricName, setFullScreenMetricName] = useState('');

    useEffect(() => {
        dispatch(loadSeries(computePlan.key));
    }, [computePlan.key]);

    const loading = useAppSelector((state) => state.series.loading);
    const series = useAppSelector((state) => state.series.series);

    const seriesGroups: SerieT[][] = useMemo(() => {
        const filteredSeries = series.filter((serie) =>
            selectedNodeKeys.includes(serie.worker)
        );
        return buildSeriesGroups(filteredSeries);
    }, [series, selectedNodeKeys]);

    if (loading) {
        return <LoadingState message="Loading compute plan data..." />;
    } else if (series?.length < 1) {
        return (
            <p>
                There is no data to display: there are no test tasks in status
                done.
            </p>
        );
    } else if (seriesGroups.length === 0) {
        return <p>Select at least one node to display the data</p>;
    } else if (fullScreenMetricName !== '') {
        const [fullScreenSerie] = seriesGroups.filter(
            (group) => group[0].metricName === fullScreenMetricName
        );
        return (
            <PerfFullScreen
                onClickClose={() => setFullScreenMetricName('')}
                series={fullScreenSerie}
            />
        );
    } else {
        return (
            <Wrap width="80%">
                {seriesGroups.map((series) => (
                    <WrapItem key={series[0].id}>
                        <PerformanceCard
                            title={series[0].metricName}
                            onClick={() =>
                                setFullScreenMetricName(series[0].metricName)
                            }
                        >
                            <PerfChart
                                series={series}
                                displayAverage={displayAverage}
                                getSerieLabel={(serie) => serie.id.toString()}
                                zoom={false}
                                tooltip={false}
                            />
                        </PerformanceCard>
                    </WrapItem>
                ))}
            </Wrap>
        );
    }
};

export default PerfChartBuilder;
