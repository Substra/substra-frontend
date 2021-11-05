import { useMemo, useRef } from 'react';

import styled from '@emotion/styled';
import { Chart, ChartData, ChartOptions, Plugin } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ZoomPluginOptions } from 'chartjs-plugin-zoom/types/options';
import { Line } from 'react-chartjs-2';

import { SerieT } from '@/modules/series/SeriesTypes';
import { buildAverageSerie } from '@/modules/series/SeriesUtils';

import useBuildPerfChartDataset, {
    DataPoint,
} from '@/hooks/useBuildPerfChartDataset';
import usePerfChartTooltip from '@/hooks/usePerfChartTooltip';

import PerfChartResetZoom from '@/components/PerfChartResetZoom';

import { Spaces } from '@/assets/theme';

const LineContainer = styled.div`
    margin-right: ${Spaces.extraLarge};
    position: relative;

    width: 100%;
    min-height: 300px;

    & > button {
        opacity: 0;
        transition: opacity 0.1s ease-out;
    }

    &:hover > button {
        opacity: 1;
    }
`;

interface PerfChartProps {
    series: SerieT[];
    getSerieLabel: (serie: SerieT) => string;
    displayAverage?: boolean;
    zoom: boolean;
    tooltip: boolean;
}

const PerfChart = ({
    series,
    getSerieLabel,
    displayAverage,
    zoom: zoomEnabled,
    tooltip: tooltipEnabled,
}: PerfChartProps): JSX.Element => {
    const chartRef = useRef<Chart<'line'>>();
    const buildPerfChartDataset = useBuildPerfChartDataset();
    const { tooltip, tooltipPluginOptions } = usePerfChartTooltip();

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
        const averageSerie = buildAverageSerie(series);
        if (averageSerie) {
            return buildPerfChartDataset(averageSerie, 'Average', {
                color: '#000000',
                borderWidth: 3,
            });
        }
        return null;
    }, [series]);

    const seriesDatasets = useMemo(
        () =>
            series.map((serie) =>
                buildPerfChartDataset(serie, getSerieLabel(serie))
            ),
        [series]
    );

    const data = useMemo<ChartData<'line', DataPoint[]>>(
        () => ({
            labels: [...Array(maxRank + 1).keys()],
            datasets: [
                ...seriesDatasets,
                ...(averageDataset && displayAverage ? [averageDataset] : []),
            ],
        }),
        [maxRank, seriesDatasets, averageDataset, displayAverage]
    );
    const zoomPluginOptions: ZoomPluginOptions = {
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
    };

    const options: ChartOptions<'line'> = {
        animation: false,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            ...(tooltipEnabled
                ? { tooltip: tooltipPluginOptions }
                : { tooltip: { enabled: false } }),
            ...(zoomEnabled ? { zoom: zoomPluginOptions } : {}),
        },
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Rank',
                    align: 'end',
                    color: '#718096',
                    font: {
                        family: 'Inter',
                        size: 10,
                    },
                },
                grid: {
                    borderColor: '#E2E8F0',
                    color: '#EDF2F7',
                },
                ticks: {
                    color: '#A0AEC0',
                    font: {
                        family: 'Inter',
                        size: 10,
                    },
                },
            },
            y: {
                type: 'linear',
                title: {
                    display: true,
                    text: 'Performance',
                    align: 'end',
                    color: '#718096',
                    font: {
                        family: 'Inter',
                        size: 10,
                    },
                },
                grid: {
                    borderColor: '#E2E8F0',
                    color: '#EDF2F7',
                },
                ticks: {
                    color: '#A0AEC0',
                    font: {
                        family: 'Inter',
                        size: 10,
                    },
                },
            },
        },
    };

    const onResetZoomClick = () => {
        const chart = chartRef.current;
        if (chart) {
            chart.resetZoom();
        }
    };

    const plugins: Plugin<'line'>[] = [];
    if (zoomEnabled) {
        plugins.push(zoomPlugin as Plugin<'line'>);
    }

    const chart = useMemo(
        () => (
            <Line
                data={data}
                options={options}
                plugins={plugins}
                ref={chartRef}
            />
        ),
        [data]
    );

    return (
        <LineContainer>
            {chart}
            {tooltipEnabled && tooltip}
            {zoomEnabled && (
                <PerfChartResetZoom onClick={onResetZoomClick}>
                    Reset zoom
                </PerfChartResetZoom>
            )}
        </LineContainer>
    );
};

export default PerfChart;
