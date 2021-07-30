import { Fragment, useEffect, useState } from 'react';

import LoadingState from './LoadingState';
import styled from '@emotion/styled';
import { Link } from 'wouter';

import { ComputePlanType } from '@/modules/computePlans/ComputePlansTypes';
import { listMetrics, loadSeries } from '@/modules/series/SeriesSlice';

import { useAppDispatch } from '@/hooks';
import useAppSelector from '@/hooks/useAppSelector';

import { compilePath, PATHS } from '@/routes';

import Checkbox from '@/components/Checkbox';

import { Colors, Spaces } from '@/assets/theme';

const P = styled.p`
    margin-bottom: ${Spaces.medium};
`;

const Ul = styled.ul`
    margin-bottom: ${Spaces.medium};
`;

const Li = styled.li`
    margin-bottom: ${Spaces.small};
    margin-left: ${Spaces.medium};

    &:last-of-type {
        margin-bottom: 0;
    }
`;

const Spacer = styled.span`
    margin: 0 ${Spaces.small};
`;

const Button = styled.button`
    color: ${Colors.primary};
    height: 40px;
    padding: 0 ${Spaces.large};
    background: none;
    border: 1px solid ${Colors.border};
    border-radius: 20px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    margin: 0 auto;

    &:hover {
        background-color: ${Colors.darkerBackground};
    }

    &:active {
        background-color: white;
    }
`;

interface MetricKeysSelectorProps {
    computePlan: ComputePlanType;
}
const MetricKeysSelector = ({
    computePlan,
}: MetricKeysSelectorProps): JSX.Element => {
    const dispatch = useAppDispatch();

    const metrics = useAppSelector((state) => state.series.metrics);
    const metricsLoading = useAppSelector(
        (state) => state.series.metricsLoading
    );
    const [selectedMetricKeys, setSelectedMetricKeys] = useState<string[]>([]);

    useEffect(() => {
        if (!metrics.length) {
            dispatch(listMetrics(computePlan.key));
        }
    }, []);

    useEffect(() => {
        if (metrics.length && !selectedMetricKeys.length) {
            setSelectedMetricKeys(metrics.map((metric) => metric.key));
        }
    }, [metrics]);

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (selectedMetricKeys.length) {
            dispatch(loadSeries(selectedMetricKeys));
        }
    };

    const onChange = (metricKey: string) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const checked = event.target.checked;
        const inList = selectedMetricKeys.includes(metricKey);

        if (checked && !inList) {
            setSelectedMetricKeys([...selectedMetricKeys, metricKey]);
        }

        if (!checked && inList) {
            setSelectedMetricKeys(
                selectedMetricKeys.filter((v) => v !== metricKey)
            );
        }
    };

    return (
        <div>
            {metricsLoading && <LoadingState message="Loading metrics..." />}
            {!metricsLoading &&
                !metrics.length &&
                'This compute plan contains no test task.'}
            {!metricsLoading && metrics.length && (
                <Fragment>
                    <P>Select the metrics you want to compare.</P>
                    <form onSubmit={onSubmit}>
                        <Ul>
                            {metrics.map((metric) => (
                                <Li key={metric.key}>
                                    <label>
                                        <Checkbox
                                            value={metric.key}
                                            checked={selectedMetricKeys.includes(
                                                metric.key
                                            )}
                                            onChange={onChange(metric.key)}
                                        />
                                        <Spacer>{metric.metrics.name}</Spacer>
                                        <Spacer>&ndash;</Spacer>
                                        <Link
                                            href={compilePath(PATHS.METRIC, {
                                                key: metric.key,
                                            })}
                                        >
                                            metric details ({metric.key})
                                        </Link>
                                    </label>
                                </Li>
                            ))}
                        </Ul>
                        <Button type="submit">Compare metrics</Button>
                    </form>
                </Fragment>
            )}
        </div>
    );
};

export default MetricKeysSelector;
