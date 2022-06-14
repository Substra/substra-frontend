/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Chart as ChartJS, Plugin, ChartEvent } from 'chart.js';
import { DistributiveArray } from 'chart.js/types/utils';

import chakraTheme from '@/assets/chakraTheme';
import { DataPoint } from '@/modules/series/SeriesTypes';

// this state management is taken from the ChartJS Zoom Plugin
// https://github.com/chartjs/chartjs-plugin-zoom/blob/4e3a12dab1ea1d62923bb2ebfc6d4aeebd757207/src/state.js#L3
const chartStates = new WeakMap<ChartJS, HighlightState>();

const PAN_THRESHOLD = 10;

interface HighlightState {
    hoveredRank: number | null;
    selectedRank: number | null;
    // the following properties allow to differentiate between normal clicks and clicks at the end of drags
    isMouseDown: boolean;
    mouseDownAtX: number;
    mouseDownAtY: number;
    isDrag: boolean;
}

const getState = (chart: ChartJS): HighlightState => {
    let state: HighlightState | undefined = chartStates.get(chart);
    if (!state) {
        state = {
            hoveredRank: null,
            selectedRank: null,
            isMouseDown: false,
            mouseDownAtX: 0,
            mouseDownAtY: 0,
            isDrag: false,
        };
        chartStates.set(chart, state);
    }
    return state;
};

const removeState = (chart: ChartJS) => {
    chartStates.delete(chart);
};

// Plugin

const getRank = (chart: ChartJS, event: ChartEvent): number | null => {
    const elements = chart.getElementsAtEventForMode(
        // @ts-ignore: event is not the right type
        event,
        'index',
        { intersect: false },
        true
    );

    if (elements.length) {
        const element = elements[0];
        const point = chart.data.datasets[element.datasetIndex].data[
            element.index
        ] as DataPoint;
        return point.x;
    }

    return null;
};

interface HighlightRankPluginProps {
    setHoveredRank: (rank: number | null) => void;
    setSelectedRank: (rank: number | null) => void;
    isRankSelectable: boolean;
}
export const highlightRankPlugin = ({
    setHoveredRank,
    setSelectedRank,
    isRankSelectable,
}: HighlightRankPluginProps): Plugin => ({
    id: 'HighlightedLinePlugin',
    beforeDatasetDraw: (chart: ChartJS): void => {
        const { ctx, chartArea, scales } = chart;
        const state = getState(chart);

        const highlightRank = (rank: number, color: string) => {
            ctx.save();
            ctx.strokeStyle = color;
            ctx.strokeRect(
                scales.x.getPixelForValue(rank),
                chartArea.top,
                0,
                chartArea.height
            );
            ctx.restore();
        };

        if (state.selectedRank !== null) {
            highlightRank(state.selectedRank, chakraTheme.colors.teal['500']);
        } else if (state.hoveredRank !== null) {
            highlightRank(state.hoveredRank, chakraTheme.colors.teal['300']);
        }
    },
    beforeEvent: (chart: ChartJS, args): void => {
        const event = args.event;
        const state = getState(chart);
        const newState: {
            hoveredRank: undefined | null | number;
            selectedRank: undefined | null | number;
        } = {
            hoveredRank: undefined,
            selectedRank: undefined,
        };

        if (event.type === 'mouseout') {
            newState.hoveredRank = null;
            state.isMouseDown = false;
            state.mouseDownAtX = 0;
            state.mouseDownAtY = 0;
            state.isDrag = false;
        } else if (event.type === 'mousedown') {
            state.isMouseDown = true;
            state.mouseDownAtX = event.x === null ? 0 : event.x;
            state.mouseDownAtY = event.y === null ? 0 : event.y;
        } else if (event.type === 'mousemove') {
            if (state.isMouseDown) {
                const x = event.x === null ? 0 : event.x;
                const y = event.y === null ? 0 : event.y;
                if (
                    (x - state.mouseDownAtX) ** 2 +
                        (y - state.mouseDownAtY) ** 2 >=
                    PAN_THRESHOLD
                ) {
                    // mouse button is down and we've moved more than 3pixels from the original position
                    state.isDrag = true;
                }
            } else {
                // mouse button isn't down, this is not part of a drag sequence, we can change the hovered rank
                newState.hoveredRank = getRank(chart, event);
            }
        } else if (event.type === 'click') {
            if (!state.isDrag && isRankSelectable) {
                if (state.selectedRank === null) {
                    newState.selectedRank = getRank(chart, event);
                } else {
                    newState.selectedRank = null;
                }
            }
            // reset
            state.isMouseDown = false;
            state.mouseDownAtX = 0;
            state.mouseDownAtY = 0;
            state.isDrag = false;
        }

        if (
            newState.hoveredRank !== undefined &&
            newState.hoveredRank !== state.hoveredRank
        ) {
            state.hoveredRank = newState.hoveredRank;

            // trigger re-render
            // https://www.chartjs.org/docs/latest/developers/plugins.html#event-handling
            // @ts-ignore: changed does not exists on args but is watched by chartjs
            args.changed = true;

            // notify that highlighted rank changed
            setHoveredRank(newState.hoveredRank);
        }

        if (
            newState.selectedRank !== undefined &&
            newState.selectedRank !== state.selectedRank &&
            isRankSelectable
        ) {
            state.selectedRank = newState.selectedRank;

            // trigger re-render
            // https://www.chartjs.org/docs/latest/developers/plugins.html#event-handling
            // @ts-ignore: changed does not exists on args but is watched by chartjs
            args.changed = true;

            // notify that selected rank changed
            setSelectedRank(newState.selectedRank);
        }
    },
    start: (chart: ChartJS): void => {
        chart.resetHighlightedRank = () => {
            const state = getState(chart);
            state.selectedRank = null;
            state.hoveredRank = null;
            setHoveredRank(null);
            setSelectedRank(null);
            chart.update();
        };
    },
    stop: (chart: ChartJS): void => {
        removeState(chart);
    },
});

// extend chart type so that resetHighlightedRank is recognized
// adapted from https://github.com/chartjs/chartjs-plugin-zoom/blob/master/types/index.d.ts
declare module 'chart.js' {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    interface Chart<
        TType extends keyof ChartTypeRegistry = keyof ChartTypeRegistry,
        TData = DistributiveArray<ChartTypeRegistry[TType]['defaultDataPoint']>,
        TLabel = unknown
    > {
        resetHighlightedRank(): void;
    }
    /* eslint-enable @typescript-eslint/no-unused-vars */
}
