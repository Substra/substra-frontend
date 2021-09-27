import { useMemo, useRef } from 'react';

import styled from '@emotion/styled';
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { Line } from 'react-chartjs-2';

import { SerieT } from '@/modules/series/SeriesTypes';
import { buildAverageSerie } from '@/modules/series/SeriesUtils';

import useBuildPerfChartDataset from '@/hooks/useBuildPerfChartDataset';
import usePerfChartTooltip from '@/hooks/usePerfChartTooltip';

import PerfChartResetZoom from '@/components/PerfChartResetZoom';

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
    const chartRef = useRef<Chart>();
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
                pointStyle: 'circle',
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
    const zoomPluginOptions = {
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

    const options = {
        animation: false,
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

    const onResetZoomClick = () => {
        const chart = chartRef.current;
        if (chart) {
            chart.resetZoom();
        }
    };

    const chart = useMemo(
        () => (
            <Line
                type="line"
                data={data}
                options={options}
                plugins={[zoomEnabled && zoomPlugin]}
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
