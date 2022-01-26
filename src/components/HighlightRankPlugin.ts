/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Chart, Plugin, ChartEvent } from 'chart.js';

import { DataPoint } from '@/hooks/useBuildPerfChartDataset';

import chakraTheme from '@/assets/chakraTheme';

// this state management is taken from the ChartJS Zoom Plugin
// https://github.com/chartjs/chartjs-plugin-zoom/blob/4e3a12dab1ea1d62923bb2ebfc6d4aeebd757207/src/state.js#L3
const chartStates = new WeakMap<Chart, HighlightState>();

interface HighlightState {
    hoveredRank: number | null;
    selectedRank: number | null;
}

const getState = (chart: Chart): HighlightState => {
    let state: HighlightState | undefined = chartStates.get(chart);
    if (!state) {
        state = {
            hoveredRank: null,
            selectedRank: null,
        };
        chartStates.set(chart, state);
    }
    return state;
};

const removeState = (chart: Chart) => {
    chartStates.delete(chart);
};

// Plugin

const getRank = (chart: Chart, event: ChartEvent): number | null => {
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
    beforeDatasetDraw: (chart: Chart): void => {
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
    beforeEvent: (chart: Chart, args): void => {
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
        } else if (event.type === 'mousemove') {
            newState.hoveredRank = getRank(chart, event);
        } else if (event.type == 'click' && isRankSelectable) {
            if (state.selectedRank === null) {
                newState.selectedRank = getRank(chart, event);
            } else {
                newState.selectedRank = null;
            }
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
    stop: (chart: Chart): void => {
        removeState(chart);
    },
});
