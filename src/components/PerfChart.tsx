import {
    useMemo,
    useRef,
    forwardRef,
    useContext,
    useState,
    useEffect,
    useCallback,
} from 'react';

import {
    Chart as ChartJS,
    ChartData,
    ChartOptions,
    Plugin,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ZoomPluginOptions } from 'chartjs-plugin-zoom/types/options';
import { Line } from 'react-chartjs-2';

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
import { RiAddLine, RiQuestionMark, RiSubtractLine } from 'react-icons/ri';

import useBuildPerfChartDataset from '@/hooks/useBuildPerfChartDataset';
import { useKeyPress } from '@/hooks/useKeyPress';
import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import usePerfChartTooltip from '@/hooks/usePerfChartTooltip';
import { capitalize } from '@/libs/utils';
import { DataPointT, SerieT } from '@/modules/series/SeriesTypes';
import { getMaxRank, getMaxRound } from '@/modules/series/SeriesUtils';

import { highlightRankPlugin } from '@/components/HighlightRankPlugin';

ChartJS.register(
    CategoryScale,
    LinearScale,
    LineElement,
    PointElement,
    Tooltip,
    zoomPlugin
);

type PerfChartProps = {
    series: SerieT[];
    size: 'full' | 'thumbnail';
    zoomEnabled: boolean;
};

const PerfChart = forwardRef<HTMLDivElement, PerfChartProps>(
    ({ series, size, zoomEnabled }: PerfChartProps, ref): JSX.Element => {
        const {
            xAxisMode,
            highlightedSerie,
            highlightedComputePlanKey,
            highlightedOrganizationId,
            setHoveredRank,
            setSelectedRank,
        } = useContext(PerfBrowserContext);
        const chartRef = useRef<ChartJS<'line'>>();
        const buildPerfChartDataset = useBuildPerfChartDataset();
        const { tooltip, tooltipPluginOptions } = usePerfChartTooltip(
            size === 'thumbnail'
        );
        const [isZoomed, setIsZoomed] = useState<boolean>(false);

        const [maxRank, maxRound] = useMemo(() => {
            return [getMaxRank(series), getMaxRound(series)];
        }, [series]);

        const seriesDatasets = useMemo(
            () =>
                series.map((serie) =>
                    buildPerfChartDataset(serie, xAxisMode, {
                        highlightedSerie,
                        highlightedComputePlanKey,
                        highlightedOrganizationId,
                    })
                ),
            [
                series,
                xAxisMode,
                highlightedSerie,
                highlightedComputePlanKey,
                highlightedOrganizationId,
                buildPerfChartDataset,
            ]
        );

        const data = useMemo<ChartData<'line', DataPointT[]>>(() => {
            const maxXAxis = xAxisMode === 'round' ? maxRound : maxRank;

            return {
                labels: [...Array(maxXAxis + 1).keys()],
                datasets: seriesDatasets,
            };
        }, [maxRank, maxRound, seriesDatasets, xAxisMode]);

        const options = useMemo<ChartOptions<'line'>>(() => {
            const zoomPluginOptions: ZoomPluginOptions = {
                zoom: {
                    drag: {
                        enabled: true,
                        backgroundColor: 'rgba(173, 245, 244, 0.5)',
                        borderColor: '#3bcccc',
                        borderWidth: 1,
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
                    modifierKey: 'shift',
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
                            text: capitalize(xAxisMode),
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
        }, [zoomEnabled, size, xAxisMode, tooltipPluginOptions]);

        const onResetZoomClick = useCallback(() => {
            const chart = chartRef.current;
            if (chart) {
                chart.resetZoom();
                setIsZoomed(false);
            }
        }, [chartRef, setIsZoomed]);

        const onZoomInClick = useCallback(() => {
            const chart = chartRef.current;
            if (chart) {
                chart.zoom(1.1);
            }
        }, [chartRef]);

        const onZoomOutClick = useCallback(() => {
            const chart = chartRef.current;
            if (chart) {
                chart.zoom(0.9);
            }
        }, [chartRef]);

        // Keyboard interaction
        useKeyPress('r', onResetZoomClick);
        useKeyPress('+', onZoomInClick);
        useKeyPress('-', onZoomOutClick);

        useEffect(() => {
            const chart = chartRef.current;
            if (chart && chart.resetHighlightedRank) {
                chart.resetHighlightedRank();
            }
        }, [xAxisMode]);

        const plugins: Plugin<'line'>[] = useMemo(
            () => [
                highlightRankPlugin({
                    isRankSelectable: size === 'full',
                    setHoveredRank,
                    setSelectedRank,
                }) as Plugin<'line'>,
            ],
            [setHoveredRank, setSelectedRank, size]
        );
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
            [data, options, ref, plugins]
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
                                rightIcon={<Kbd backgroundColor="white">R</Kbd>}
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
                                borderRight="none"
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
                                                mousewheel or click and drag to
                                                select the zoom area. You can
                                                also use <Kbd>+</Kbd> and{' '}
                                                <Kbd>-</Kbd>. Use <Kbd>r</Kbd>{' '}
                                                to reset zoom.
                                            </Text>
                                            <Text fontSize="xs">
                                                To go back you can use{' '}
                                                <Kbd>Escape</Kbd>
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
