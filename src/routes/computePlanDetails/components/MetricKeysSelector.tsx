import styled from '@emotion/styled';
import { Link } from 'wouter';

import { setSelectedMetricKeys } from '@/modules/series/SeriesSlice';

import { useAppDispatch } from '@/hooks';
import useAppSelector from '@/hooks/useAppSelector';

import { compilePath, PATHS } from '@/routes';

import Checkbox from '@/components/Checkbox';

import { Spaces } from '@/assets/theme';

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

const MetricKeysSelector = (): JSX.Element => {
    const dispatch = useAppDispatch();

    const metrics = useAppSelector((state) => state.series.metrics);
    const selectedMetricKeys = useAppSelector(
        (state) => state.series.selectedMetricKeys
    );

    const onChange = (metricKey: string) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const checked = event.target.checked;
        const inList = selectedMetricKeys.includes(metricKey);

        if (checked && !inList) {
            dispatch(setSelectedMetricKeys([...selectedMetricKeys, metricKey]));
        }

        if (!checked && inList) {
            dispatch(
                setSelectedMetricKeys(
                    selectedMetricKeys.filter((v) => v !== metricKey)
                )
            );
        }
    };

    return (
        <div>
            <P>Select the metrics you want to compare.</P>
            <form onSubmit={(e: React.FormEvent) => e.preventDefault()}>
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
                                {/* <Spacer>&ndash;</Spacer> */}
                                <Link
                                    href={compilePath(PATHS.METRIC, {
                                        key: metric.key,
                                    })}
                                >
                                    {metric.name}
                                </Link>
                            </label>
                        </Li>
                    ))}
                </Ul>
            </form>
        </div>
    );
};

export default MetricKeysSelector;
