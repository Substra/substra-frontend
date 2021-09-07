import { Fragment, RefObject, useMemo, useRef } from 'react';

import PerfChartLegend from './PerfChartLegend';
import styled from '@emotion/styled';
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { toJpeg } from 'html-to-image';
import { Line } from 'react-chartjs-2';

import { SerieT } from '@/modules/series/SeriesTypes';

import useKeyFromPath from '@/hooks/useKeyFromPath';
import useNodesChartStyles from '@/hooks/useNodesChartStyles';

import { PATHS } from '@/routes';

import { Colors, Fonts, Spaces } from '@/assets/theme';

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    margin: ${Spaces.extraLarge} 0 ${Spaces.small} 0;
`;

const LineContainer = styled.div`
    width: 500px;
    margin-right: ${Spaces.extraLarge};
    position: relative;
`;

const ResetZoom = styled.button`
    position: absolute;
    top: 0;
    right: 0;
    cursor: pointer;
    border: 1px solid ${Colors.border};
    border-radius: 4px;
    padding: ${Spaces.extraSmall} ${Spaces.small};
    background-color: ${Colors.background};
    font-size: ${Fonts.sizes.smallBody};

    &:hover {
        border-color: ${Colors.primary};
        color: ${Colors.primary};
    }
`;

interface DownloadButtonProps {
    disabled: boolean;
}

const DownloadButton = styled.button<DownloadButtonProps>`
    color: ${Colors.primary};
    height: 40px;
    min-width: 200px;
    background: none;
    border: 1px solid ${Colors.border};
    border-radius: 20px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    text-align: center;
    margin: 0 auto ${Spaces.extraLarge} auto;
    opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
    cursor: pointer;

    &:hover {
        background-color: ${Colors.darkerBackground};
    }

    &:active {
        background-color: white;
    }
`;

const average = (values: number[]): number => {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
};

interface PerfChartProps {
    series: SerieT[];
    displayAverage: boolean;
}
const PerfChart = ({ series, displayAverage }: PerfChartProps): JSX.Element => {
    const chartRef = useRef<Chart>();
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

    const downloadRef: RefObject<HTMLDivElement> = useRef<HTMLDivElement>(null);
    const key = useKeyFromPath(PATHS.COMPUTE_PLAN_CHART);

    const downloadImage = (ref: HTMLElement | null) => {
        if (ref === null) {
            return;
        }

        toJpeg(ref, { backgroundColor: '#fff' }).then((dataUrl) => {
            const link = document.createElement('a');
            link.download = `cp_${key}.jpeg`;
            link.href = dataUrl;
            link.click();
        });
    };

    const onResetZoomClick = () => {
        const chart = chartRef.current;
        if (chart) {
            chart.resetZoom();
        }
    };

    return (
        <Fragment>
            <Container ref={downloadRef}>
                <LineContainer>
                    <Line
                        type="line"
                        data={data}
                        options={options}
                        plugins={[zoomPlugin]}
                        ref={chartRef}
                    />
                    <ResetZoom onClick={onResetZoomClick}>Reset zoom</ResetZoom>
                </LineContainer>
                <PerfChartLegend series={series} />
            </Container>

            <DownloadButton
                disabled={!downloadRef.current}
                onClick={() => downloadImage(downloadRef.current)}
            >
                Download Chart
            </DownloadButton>
        </Fragment>
    );
};

export default PerfChart;
