import {
    useMemo,
    useRef,
    forwardRef,
    useContext,
    useState,
    useEffect,
} from 'react';

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
    ButtonGroup,
} from '@chakra-ui/react';
import { Chart, ChartData, ChartOptions, Plugin } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ZoomPluginOptions } from 'chartjs-plugin-zoom/types/options';
import { Line } from 'react-chartjs-2';
import { RiAddLine, RiQuestionMark, RiSubtractLine } from 'react-icons/ri';

import { SerieT } from '@/modules/series/SeriesTypes';
import { getMaxEpoch, getMaxRank } from '@/modules/series/SeriesUtils';

import useBuildPerfChartDataset, {
    DataPoint,
} from '@/hooks/useBuildPerfChartDataset';
import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import usePerfChartTooltip from '@/hooks/usePerfChartTooltip';

import { highlightRankPlugin } from '@/components/HighlightRankPlugin';

interface PerfChartProps {
    series: SerieT[];
    size: 'full' | 'thumbnail';
    zoomEnabled: boolean;
    highlightedSerie?: { id: number; computePlanKey: string };
    setHoveredRank: (rank: number | null) => void;
    setSelectedRank: (rank: number | null) => void;
}

const PerfChart = forwardRef<HTMLDivElement, PerfChartProps>(
    (
        {
            series,
            size,
            zoomEnabled,
            highlightedSerie,
            setHoveredRank,
            setSelectedRank,
        }: PerfChartProps,
        ref
    ): JSX.Element => {
        const { xAxisMode } = useContext(PerfBrowserContext);
        const chartRef = useRef<Chart<'line'>>();
        const buildPerfChartDataset = useBuildPerfChartDataset();
        const { tooltip, tooltipPluginOptions } = usePerfChartTooltip(
            series,
            size === 'thumbnail'
        );
        const [isZoomed, setIsZoomed] = useState<boolean>(false);

        const maxRank = getMaxRank(series);
        const maxEpoch = getMaxEpoch(series);

        const seriesDatasets = useMemo(
            () =>
                series.map((serie) =>
                    buildPerfChartDataset(
                        serie,
                        `${serie.computePlanKey}-${serie.id}`,
                        highlightedSerie
                    )
                ),
            [series, highlightedSerie]
        );

        const data = useMemo<ChartData<'line', DataPoint[]>>(
            () => ({
                labels: [
                    ...Array(
                        (xAxisMode === 'rank' ? maxRank : maxEpoch) + 1
                    ).keys(),
                ],
                datasets: seriesDatasets,
            }),
            [maxRank, maxEpoch, seriesDatasets]
        );

        const options = useMemo<ChartOptions<'line'>>(() => {
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
                    onZoom: () => {
                        setIsZoomed(true);
                    },
                },
                pan: {
                    enabled: true,
                    mode: 'xy',
                    threshold: 0.01,
                },
            };
            return {
                animation: false,
                ...(size === 'thumbnail'
                    ? {
                          interaction: {
                              mode: 'index',
                              intersect: false,
                          },
                      }
                    : {}),
                // default list of events + mousedown
                events: [
                    'mousemove',
                    'mousedown',
                    'mouseout',
                    'click',
                    'touchstart',
                    'touchmove',
                ],
                hover: {
                    mode: 'index',
                    intersect: false,
                },
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: tooltipPluginOptions,
                    ...(zoomEnabled ? { zoom: zoomPluginOptions } : {}),
                },
                scales: {
                    x: {
                        type: 'category',
                        title: {
                            display: true,
                            text: xAxisMode === 'rank' ? 'Rank' : 'Epoch',
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
        }, [zoomEnabled, size, xAxisMode]);

        const onResetZoomClick = () => {
            const chart = chartRef.current;
            if (chart) {
                chart.resetZoom();
                setIsZoomed(false);
            }
        };

        const onZoomInClick = () => {
            const chart = chartRef.current;
            if (chart) {
                chart.zoom(1.1);
            }
        };

        const onZoomOutClick = () => {
            const chart = chartRef.current;
            if (chart) {
                chart.zoom(0.9);
            }
        };

        useEffect(() => {
            const chart = chartRef.current;
            if (chart && chart.resetHighlightedRank) {
                chart.resetHighlightedRank();
            }
        }, [xAxisMode]);

        const plugins: Plugin<'line'>[] = [
            highlightRankPlugin({
                isRankSelectable: size === 'full',
                setHoveredRank,
                setSelectedRank,
            }) as Plugin<'line'>,
        ];
        if (zoomEnabled) {
            plugins.push(zoomPlugin as Plugin<'line'>);
        }

        const chart = useMemo(
            () => (
                <Box ref={ref} padding="2" width="100%" height="100%">
                    <Line
                        data={data}
                        options={options}
                        plugins={plugins}
                        ref={chartRef}
                    />
                </Box>
            ),
            [data]
        );

        return (
            <Box position="relative" width="100%" height="100%">
                {chart}
                {tooltip}
                {zoomEnabled && (
                    <HStack position="absolute" bottom="14" right="2.5">
                        {isZoomed && (
                            <Button
                                onClick={onResetZoomClick}
                                variant="outline"
                                size="sm"
                                backgroundColor="white"
                            >
                                Reset zoom
                            </Button>
                        )}
                        <ButtonGroup isAttached>
                            <IconButton
                                aria-label="Zoom out"
                                onClick={onZoomOutClick}
                                variant="outline"
                                size="sm"
                                background="white"
                                icon={<RiSubtractLine />}
                            />
                            <IconButton
                                aria-label="Zoom in"
                                onClick={onZoomInClick}
                                variant="outline"
                                size="sm"
                                background="white"
                                icon={<RiAddLine />}
                            />
                        </ButtonGroup>
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
