/** @jsxRuntime classic */

/** @jsx jsx */
import { Fragment, RefObject, useMemo, useRef, useState } from 'react';

import PerfChartLegend from './PerfChartLegend';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { toJpeg } from 'html-to-image';
import { Line } from 'react-chartjs-2';
import CsvDownloader, { ICsvProps } from 'react-csv-downloader';
import { RiDownloadLine } from 'react-icons/ri';

import { csvPerfChartColumns } from '@/modules/computePlans/ComputePlansConstants';
import { SerieT } from '@/modules/series/SeriesTypes';

import { useAppSelector } from '@/hooks';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import useNodeChartStyle from '@/hooks/useNodeChartStyle';

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

    & > button {
        opacity: 0;
        transition: opacity 0.1s ease-out;
    }

    &:hover > button {
        opacity: 1;
    }
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

const Header = styled.div`
    display: flex;
    align-items: baseline;
    width: 100%;
    margin: 0 -${Spaces.small};
`;
const Title = styled.div`
    font-size: ${Fonts.sizes.h2};
    font-weight: bold;
    color: ${Colors.content};
    margin: 0 ${Spaces.small};
`;
interface DownloadButtonProps {
    active: boolean;
}
interface DownloadItemProps {
    disabled: boolean;
}

const DownloadButton = styled.button<DownloadButtonProps>`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${Colors.primary};
    height: 25px;
    width: 25px;
    background: ${({ active }) => (active ? Colors.darkerBackground : 'none')};
    border: 1px solid ${Colors.border};
    border-radius: 50%;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    text-align: center;
    margin: 0 ${Spaces.small};
    cursor: pointer;

    &:hover {
        background-color: ${Colors.darkerBackground};
    }
`;

const DownloadMenu = styled.ul`
    position: absolute;
    top: 30px;
    left: 0;
    width: 200px;
    border-radius: ${Spaces.medium};
    background-color: white;
    box-shadow: 0 0 8px ${Colors.border};
    z-index: 10;
    transition: all 0.1s linear;
`;

const invisibleContainer = css`
    opacity: 0;
    top: 26px;
    pointer-events: none;
`;

const DownloadItem = styled.li<DownloadItemProps>`
    padding: ${Spaces.medium};
    opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
    pointer-events: ${({ disabled }) => (disabled ? 'none' : 'inherit')};

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
    displayMultiChart: boolean;
}
const PerfChart = ({
    series,
    displayAverage,
    displayMultiChart,
}: PerfChartProps): JSX.Element => {
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const chartRef = useRef<Chart>();
    const computePlan = useAppSelector(
        (state) => state.computePlans.computePlan
    );

    const nodeChartStyle = useNodeChartStyle();

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

    const csvDatas: ICsvProps['datas'] = useMemo(() => {
        const datas = [];
        for (const serie of series) {
            for (const point of serie.points) {
                datas.push({
                    computePlanTag: computePlan?.tag || '',
                    computePlanMetadata: JSON.stringify(
                        computePlan?.metadata || {}
                    ),
                    worker: serie.worker,
                    objectiveKey: serie.metricKey,
                    datasetKey: serie.datasetKey,
                    metricName: serie.metricName,
                    testtupleKey: point.testTaskKey,
                    testtupleRank: point.rank.toString(),
                    perfValue: point.perf?.toString(),
                });
            }
        }
        return datas;
    }, [series]);

    const onResetZoomClick = () => {
        const chart = chartRef.current;
        if (chart) {
            chart.resetZoom();
        }
    };

    const closeDownloadMenu = () => {
        setShowDownloadMenu(false);
        document.removeEventListener('click', closeDownloadMenu);
    };

    const toggleDownloadMenu = (e: React.MouseEvent) => {
        if (showDownloadMenu) {
            closeDownloadMenu();
            return;
        }
        setShowDownloadMenu(true);
        e.stopPropagation();
        document.addEventListener('click', closeDownloadMenu);
    };

    const perfChartTitle = useMemo(() => {
        const metricName = series[0].metricName;
        const title = `${metricName
            .charAt(0)
            .toUpperCase()}${metricName.substring(1)}`;

        return displayMultiChart
            ? `${title} - ${series[0].worker}`
            : `${title} - All nodes`;
    }, [series]);

    return (
        <Fragment>
            <Header>
                <Title>{perfChartTitle}</Title>
                <DownloadButton
                    active={showDownloadMenu}
                    onClick={toggleDownloadMenu}
                >
                    <RiDownloadLine />
                    <DownloadMenu
                        css={[!showDownloadMenu && invisibleContainer]}
                    >
                        <DownloadItem
                            disabled={!downloadRef.current}
                            onClick={(e) => {
                                downloadImage(downloadRef.current);
                                toggleDownloadMenu(e);
                            }}
                        >
                            Download As Jpeg
                        </DownloadItem>
                        <DownloadItem
                            disabled={!csvDatas}
                            onClick={toggleDownloadMenu}
                        >
                            <CsvDownloader
                                filename={`cp_${key}`}
                                datas={csvDatas}
                                columns={csvPerfChartColumns}
                            >
                                Download As CSV
                            </CsvDownloader>
                        </DownloadItem>
                    </DownloadMenu>
                </DownloadButton>
            </Header>
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
        </Fragment>
    );
};

export default PerfChart;
