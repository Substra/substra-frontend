import { useMemo, useState } from 'react';

import PerfChartLegend from './PerfChartLegend';
import styled from '@emotion/styled';
import { Line } from 'react-chartjs-2';

import { SerieT } from '@/modules/series/SeriesTypes';

import useNodesChartStyles from '@/hooks/useNodesChartStyles';

import Checkbox from '@/components/Checkbox';

import { Spaces } from '@/assets/theme';

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: ${Spaces.extraLarge} 0;
`;

const LabelContainer = styled.div`
    margin-bottom: ${Spaces.medium};

    & > label > div {
        margin-right: ${Spaces.medium};
    }
`;

const LineContainer = styled.div`
    width: 500px;
    margin-right: ${Spaces.extraLarge};
`;

const average = (values: number[]): number => {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
};

interface PerfChartProps {
    series: SerieT[];
}
const PerfChart = ({ series }: PerfChartProps): JSX.Element => {
    const [displayAverage, setDisplayAverage] = useState(true);

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
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Rank',
                },
                grid: {
                    display: false,
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Perf',
                },
            },
        },
    };

    return (
        <Container>
            {averageDataset && (
                <LabelContainer>
                    <label>
                        <Checkbox
                            checked={displayAverage}
                            onChange={() => setDisplayAverage(!displayAverage)}
                        />
                        Display average perf
                    </label>
                </LabelContainer>
            )}
            <LineContainer>
                <Line type="line" data={data} options={options} />
            </LineContainer>
            <PerfChartLegend series={series} />
        </Container>
    );
};

export default PerfChart;
