import { useMemo } from 'react';

import PerfChartLegend from './PerfChartLegend';
import styled from '@emotion/styled';
import { Line } from 'react-chartjs-2';

import { SerieT } from '@/modules/series/SeriesTypes';

import useNodesChartStyles from '@/hooks/useNodesChartStyles';

import { Spaces } from '@/assets/theme';

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: ${Spaces.extraLarge} 0;
`;

const LineContainer = styled.div`
    width: 500px;
    margin-right: ${Spaces.extraLarge};
`;

interface PerfChartProps {
    series: SerieT[];
}
const PerfChart = ({ series }: PerfChartProps): JSX.Element => {
    const nodesChartStyles = useNodesChartStyles();

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

    const data = useMemo(
        () => ({
            labels: [...Array(maxRank + 1).keys()],
            datasets: series.map((serie) => ({
                label: serie.id,
                data: serie.points.map((point) => ({
                    x: point.rank,
                    y: point.perf,
                    testTaskKey: point.testTaskKey,
                })),
                parsing: false,
                // styles
                backgroundColor: nodesChartStyles[serie.worker].color,
                borderColor: nodesChartStyles[serie.worker].color,
                // line styles
                borderWidth: 2,
                // point styles
                pointStyle: nodesChartStyles[serie.worker].pointStyle,
                pointBackgroundColor: 'white',
                pointBorderColor: nodesChartStyles[serie.worker].color,
                pointBorderWidth: 2,
            })),
        }),
        [maxRank, series]
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
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <Container>
            <LineContainer>
                <Line type="line" data={data} options={options} />
            </LineContainer>
            <PerfChartLegend series={series} />
        </Container>
    );
};

export default PerfChart;
