import { useMemo, useRef } from 'react';

import styled from '@emotion/styled';
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from 'react-chartjs-2';

import { SerieT } from '@/modules/series/SeriesTypes';

import useNodeChartStyle from '@/hooks/useNodeChartStyle';

import { Spaces } from '@/assets/theme';

const LineContainer = styled.div`
    width: 500px;
    margin-right: ${Spaces.extraLarge};
    position: relative;

    & > button {
        opacity: 0;
        transition: opacity 0.1s ease-out;
    }

    &:hover > button {
        opacity: 1;
    }
`;

const average = (values: number[]): number => {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
};

interface BasePerfChartProps {
    series: SerieT[];
    getSerieLabel: (serie: SerieT) => string;
    displayAverage?: boolean;
    children?: JSX.Element;
}

const BasePerfChart = ({
    series,
    getSerieLabel,
    displayAverage,
    children,
}: BasePerfChartProps): JSX.Element => {
    const nodeChartStyle = useNodeChartStyle();
    const chartRef = useRef<Chart>();

    const maxRank = useMemo(
        () =>
            series.reduce((max, serie) => {
                const serieMax = serie.points.reduce(
                    (max, point) => Math.max(max, point.rank),
                    0
                );
                return Math.max(max, serieMax);
            }, 0),
        [series]
    );

    const averageDataset = useMemo(() => {
        if (series.length < 2) {
            return null;
        }

        const ranksPerfs: Record<number, number[]> = {};
        for (const serie of series) {
            for (const point of serie.points) {
                if (point.perf !== null) {
                    ranksPerfs[point.rank] = ranksPerfs[point.rank]
                        ? [...ranksPerfs[point.rank], point.perf]
                        : [point.perf];
                }
            }
        }

        return {
            label: 'Average',
            data: Object.entries(ranksPerfs)
                .filter(([, perfs]) => perfs.length === series.length)
                .map(([rank, perfs]) => ({
                    x: parseInt(rank),
                    y: average(perfs),
                    testTaskKey: `average for rank ${rank}`,
                })),
            parsing: false,
            // styles
            backgroundColor: '#000',
            borderColor: '#000',
            // line styles
            borderWidth: 3,
            // point styles
            pointStyle: 'circle',
            pointBackgroundColor: 'white',
            pointBorderColor: '#000',
            pointBorderWidth: 3,
        };
    }, [series]);

    const seriesDatasets = useMemo(
        () =>
            series.map((serie) => ({
                label: getSerieLabel(serie),
                data: serie.points.map((point) => ({
                    x: point.rank,
                    y: point.perf,
                    testTaskKey: point.testTaskKey,
                })),
                parsing: false,
                // styles
                backgroundColor: nodeChartStyle(serie.worker).color,
                borderColor: nodeChartStyle(serie.worker).color,
                // line styles
                borderWidth: 2,
                // point styles
                pointStyle: nodeChartStyle(serie.worker).pointStyle,
                pointBackgroundColor: 'white',
                pointBorderColor: nodeChartStyle(serie.worker).color,
                pointBorderWidth: 2,
            })),
        [series]
    );

    const data = useMemo(
        () => ({
            labels: [...Array(maxRank + 1).keys()],
            datasets: [
                ...seriesDatasets,
                ...(averageDataset && displayAverage ? [averageDataset] : []),
            ],
        }),
        [maxRank, seriesDatasets, averageDataset, displayAverage]
    );

    const options = {
        animation: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    title: (items) => `Rank ${items[0].raw.x}`,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    label: (item) => `Perf: ${item.raw.y.toFixed(3)}`,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    afterLabel: (item) => `Test task ${item.raw.testTaskKey}`,
                },
            },
            zoom: {
                zoom: {
                    drag: {
                        enabled: false,
                    },
                    wheel: {
                        enabled: true,
                        speed: 0.1,
                    },
                    pinch: {
                        enabled: true,
                    },
                    mode: 'xy',
                    overScaleMode: 'xy',
                },
                pan: {
                    enabled: true,
                    mode: 'xy',
                    threshold: 0.01,
                    modifierKey: 'shift',
                },
            },
        },
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'RANK',
                },
                grid: {
                    display: false,
                },
            },
            y: {
                type: 'linear',
                title: {
                    display: true,
                    text: series.length
                        ? series[0].metricName.toUpperCase()
                        : 'PERF',
                },
            },
        },
    };

    return (
        <LineContainer>
            <Line
                type="line"
                data={data}
                options={options}
                plugins={[zoomPlugin]}
                ref={chartRef}
            />
            {children}
        </LineContainer>
    );
};

export default BasePerfChart;
