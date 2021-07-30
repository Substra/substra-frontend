import { Fragment, useMemo, useState } from 'react';
import { useEffect } from 'react';

import LoadingState from './LoadingState';
import MetricKeysSelector from './MetricKeysSelector';
import PerfChart from './PerfChart';
import styled from '@emotion/styled';

import { ComputePlanType } from '@/modules/computePlans/ComputePlansTypes';
import { resetSeries } from '@/modules/series/SeriesSlice';
import { SerieT } from '@/modules/series/SeriesTypes';

import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';

import Checkbox from '@/components/Checkbox';

import { Spaces } from '@/assets/theme';

const LabelContainer = styled.div`
    margin-bottom: ${Spaces.medium};

    & > label > div {
        margin-right: ${Spaces.medium};
    }
`;

interface PerfChartBuilderProps {
    computePlan: ComputePlanType;
}
const PerfChartBuilder = ({
    computePlan,
}: PerfChartBuilderProps): JSX.Element => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(resetSeries(computePlan.key));
    }, []);

    const selectedMetricKeys = useAppSelector(
        (state) => state.series.selectedMetricKeys
    );
    const seriesLoading = useAppSelector((state) => state.series.seriesLoading);
    const series = useAppSelector((state) => state.series.series);

    const [multiChart, setMultiChart] = useState(false);

    const seriesGroups: SerieT[][] = useMemo(() => {
        const groups = [];

        if (multiChart) {
            const workers = new Set(series.map((serie) => serie.worker));
            for (const worker of workers) {
                groups.push(series.filter((serie) => serie.worker === worker));
            }
        } else {
            groups.push(series);
        }

        return groups;
    }, [multiChart, series]);

    if (!selectedMetricKeys.length) {
        return <MetricKeysSelector computePlan={computePlan} />;
    } else if (seriesLoading) {
        return <LoadingState message="Loading series..." />;
    } else if (!seriesGroups.length) {
        return (
            <p>
                There is no data to display: none of the test tasks are in
                status done.
            </p>
        );
    } else {
        return (
            <Fragment>
                <LabelContainer>
                    <label>
                        <Checkbox
                            checked={multiChart}
                            onChange={() => setMultiChart(!multiChart)}
                        />
                        Display each node on a separate chart
                    </label>
                </LabelContainer>
                {seriesGroups.map((series) => (
                    <PerfChart
                        series={series}
                        key={series.map((serie) => serie.id).join('-')}
                    />
                ))}
            </Fragment>
        );
    }
};

export default PerfChartBuilder;
