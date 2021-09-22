import { Fragment, useMemo, useState } from 'react';
import { useEffect } from 'react';

import MetricKeysSelector from './MetricKeysSelector';
import PerfChart from './PerfChart';
import styled from '@emotion/styled';

import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { loadSeries } from '@/modules/series/SeriesSlice';
import { SerieT } from '@/modules/series/SeriesTypes';
import { buildSeriesGroups } from '@/modules/series/SeriesUtils';

import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';

import Checkbox from '@/components/Checkbox';
import LoadingState from '@/components/LoadingState';

import { Spaces } from '@/assets/theme';

const LabelContainer = styled.div`
    margin-bottom: ${Spaces.medium};

    & > label > div {
        margin-right: ${Spaces.medium};
    }
`;

interface PerfChartBuilderProps {
    computePlan: ComputePlanT;
}
const PerfChartBuilder = ({
    computePlan,
}: PerfChartBuilderProps): JSX.Element => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(loadSeries(computePlan.key));
    }, [computePlan.key]);

    const loading = useAppSelector((state) => state.series.loading);
    const series = useAppSelector((state) => state.series.series);

    const selectedMetricKeys = useAppSelector(
        (state) => state.series.selectedMetricKeys
    );

    const [multiChart, setMultiChart] = useState(false);
    const [displayAverage, setDisplayAverage] = useState(true);

    const seriesGroups: SerieT[][] = useMemo(
        () =>
            buildSeriesGroups(
                series.filter((serie) =>
                    selectedMetricKeys.includes(serie.metricKey)
                ),
                multiChart
            ),
        [series, multiChart, selectedMetricKeys]
    );

    const maxNumberOfSeriesPerGroup: number = useMemo(() => {
        let max = 0;
        for (const series of seriesGroups) {
            max = Math.max(max, series.length);
        }
        return max;
    }, [seriesGroups]);

    if (loading) {
        return <LoadingState message="Loading compute plan data..." />;
    } else if (series?.length < 1) {
        return (
            <p>
                There is no data to display: there are no test tasks in status
                done.
            </p>
        );
    } else {
        return (
            <Fragment>
                <MetricKeysSelector />
                <LabelContainer>
                    <label>
                        <Checkbox
                            checked={multiChart}
                            onChange={() => setMultiChart(!multiChart)}
                        />
                        Display each node on a separate chart
                    </label>
                </LabelContainer>
                <LabelContainer>
                    <label>
                        <Checkbox
                            checked={displayAverage}
                            onChange={() => setDisplayAverage(!displayAverage)}
                            disabled={maxNumberOfSeriesPerGroup < 2}
                        />
                        Display average perf
                    </label>
                </LabelContainer>
                {seriesGroups.map((series) => (
                    <PerfChart
                        series={series}
                        displayAverage={displayAverage}
                        displayMultiChart={multiChart}
                        key={series.map((serie) => serie.id).join('-')}
                    />
                ))}
            </Fragment>
        );
    }
};

export default PerfChartBuilder;
