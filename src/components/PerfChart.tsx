import { useMemo, useRef, forwardRef, useContext } from 'react';

import {
    Box,
    HStack,
    IconButton,
    Kbd,
    Popover,
    PopoverContent,
    PopoverTrigger,
    PopoverCloseButton,
    Text,
    PopoverHeader,
    PopoverBody,
    VStack,
    Button,
} from '@chakra-ui/react';
import { Chart, ChartData, ChartOptions, Plugin } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ZoomPluginOptions } from 'chartjs-plugin-zoom/types/options';
import { Line } from 'react-chartjs-2';
import { RiQuestionMark } from 'react-icons/ri';

import { SerieT } from '@/modules/series/SeriesTypes';
import { buildAverageSerie, getMaxRank } from '@/modules/series/SeriesUtils';

import useBuildPerfChartDataset, {
    DataPoint,
} from '@/hooks/useBuildPerfChartDataset';
import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import usePerfChartTooltip from '@/hooks/usePerfChartTooltip';

import { highlightRankPlugin } from '@/components/HighlightRankPlugin';

interface PerfChartProps {
    series: SerieT[];
    interactive: boolean;
    highlightedSerie?: { id: number; computePlanKey: string } | undefined;
    setHoveredRank: (rank: number | null) => void;
    setSelectedRank: (rank: number | null) => void;
}

const PerfChart = forwardRef<HTMLDivElement, PerfChartProps>(
    (
        {
            series,
            interactive,
            highlightedSerie,
            setHoveredRank,
            setSelectedRank,
        }: PerfChartProps,
        ref
    ): JSX.Element => {
        const { displayAverage } = useContext(PerfBrowserContext);
        const chartRef = useRef<Chart<'line'>>();
        const buildPerfChartDataset = useBuildPerfChartDataset();
        const { tooltip, tooltipPluginOptions } = usePerfChartTooltip(series);

        const maxRank = getMaxRank(series);

        const averageDataset = useMemo(() => {
            const averageSerie = buildAverageSerie(series);
            if (averageSerie) {
                return buildPerfChartDataset(averageSerie, 'Average', {
                    color: '#000000',
                    colorScheme: 'black',
                    borderWidth: 3,
                });
            }
            return null;
        }, [series]);

        const seriesDatasets = useMemo(
            () =>
                series.map((serie) =>
                    buildPerfChartDataset(
                        serie,
                        `${serie.computePlanKey}-${serie.id}`,
                        undefined,
                        highlightedSerie
                    )
                ),
            [series, highlightedSerie]
        );

        const data = useMemo<ChartData<'line', DataPoint[]>>(
            () => ({
                labels: [...Array(maxRank + 1).keys()],
                datasets: [
                    ...seriesDatasets,
                    ...(averageDataset && displayAverage
                        ? [averageDataset]
                        : []),
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
            ...(interactive
                ? {
                      hover: {
                          mode: 'index',
                          intersect: false,
                      },
                  }
                : {}),
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
                ...(interactive
                    ? { tooltip: tooltipPluginOptions }
                    : { tooltip: { enabled: false } }),
                ...(interactive ? { zoom: zoomPluginOptions } : {}),
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
        if (interactive) {
            plugins.push(zoomPlugin as Plugin<'line'>);
            plugins.push(
                highlightRankPlugin({
                    setHoveredRank,
                    setSelectedRank,
                }) as Plugin<'line'>
            );
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
            <Box
                position="relative"
                width="100%"
                height="100%"
                padding="2"
                ref={ref}
            >
                {chart}
                {interactive && tooltip}
                {interactive && (
                    <HStack position="absolute" bottom="14" right="2.5">
                        <Button
                            onClick={onResetZoomClick}
                            variant="outline"
                            size="sm"
                            backgroundColor="white"
                        >
                            Reset zoom
                        </Button>
                        <Box>
                            <Popover placement="top-end">
                                <PopoverTrigger>
                                    <IconButton
                                        variant="solid"
                                        isRound
                                        size="sm"
                                        backgroundColor="gray.600"
                                        icon={<RiQuestionMark fill="white" />}
                                        aria-label="How to use"
                                    />
                                </PopoverTrigger>
                                <PopoverContent width="240px">
                                    <PopoverCloseButton top="5" right="5" />
                                    <PopoverHeader
                                        textTransform="uppercase"
                                        borderBottom="none"
                                        paddingX="5"
                                        paddingTop="5"
                                        paddingBottom="0"
                                        fontSize="xs"
                                        fontWeight="bold"
                                    >
                                        How to use
                                    </PopoverHeader>
                                    <PopoverBody padding="5">
                                        <VStack spacing="5">
                                            <Text fontSize="xs">
                                                Hover the chart to display
                                                values into this right column.
                                            </Text>
                                            <Text fontSize="xs">
                                                Click somewhere on the chart to
                                                fix value and be able to
                                                interact with them.
                                            </Text>
                                            <Text fontSize="xs">
                                                To zoom into the chart, use your
                                                mousewheel.
                                            </Text>
                                            <Text fontSize="xs">
                                                To move into the chart, use{' '}
                                                <Kbd>shift</Kbd> +{' '}
                                                <Kbd>Left click</Kbd>
                                            </Text>
                                        </VStack>
                                    </PopoverBody>
                                </PopoverContent>
                            </Popover>
                        </Box>
                    </HStack>
                )}
            </Box>
        );
    }
);

export default PerfChart;
