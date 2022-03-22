import React, {
    createContext,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { OnOptionChange } from '@/hooks/useSelection';
import {
    useSyncedState,
    useSyncedStringArrayState,
    useSyncedStringState,
} from '@/hooks/useSyncedState';
import { compareComputePlans } from '@/modules/computePlans/ComputePlanUtils';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { NodeType } from '@/modules/nodes/NodesTypes';
import { compareNodes } from '@/modules/nodes/NodesUtils';
import {
    HighlightedSerie,
    SerieRankData,
    SerieT,
} from '@/modules/series/SeriesTypes';
import {
    buildSeriesGroups,
    compareSerieRankData,
    compareSeries,
    getMaxEpochWithPerf,
    getMaxRankWithPerf,
    getSeriesNodes,
} from '@/modules/series/SeriesUtils';

export type XAxisMode = 'epoch' | 'rank';

interface PerfBrowserContext {
    // Whether the compute plan and series are being loaded
    loading: boolean;
    // List of all compute plans we're browsing series for
    computePlans: ComputePlanT[];
    // List of all the series that can be extracted from the computePlans
    series: SerieT[];
    // List of groups of series sharing the same metric name once all filters have been applied
    seriesGroups: SerieT[][];
    // List of the nodes references by all the series
    nodes: NodeType[];
    // How colors should be determined
    colorMode: 'computePlan' | 'node';
    // What unit to use for the x axis
    xAxisMode: XAxisMode;
    setXAxisMode: (xAxisMode: XAxisMode) => void;
    // List of nodes for which display series (displayed if serie.worker is in selectedNodeIds)
    selectedNodeIds: string[];
    setSelectedNodeIds: (selectedNodeIds: string[]) => void;
    isNodeIdSelected: (nodeId: string) => boolean;
    // List of compute plans for which to display series (display if serie.computePlanKey is in selectedComputePlanKeys)
    selectedComputePlanKeys: string[];
    setSelectedComputePlanKeys: (selectedComputePlanKeys: string[]) => void;
    onComputePlanKeySelectionChange: OnOptionChange;
    // Currently selected metric with its series
    selectedMetricName: string;
    setSelectedMetricName: (name: string) => void;
    selectedSeriesGroup: SerieT[];
    // Serie, compute plan and node to highlight on charts
    highlightedSerie: HighlightedSerie | undefined;
    setHighlightedSerie: (
        highlightedSerie: HighlightedSerie | undefined
    ) => void;
    highlightedComputePlanKey: string | undefined;
    setHighlightedComputePlanKey: (key: string | undefined) => void;
    highlightedNodeId: string | undefined;
    setHighlightedNodeId: (nodeId: string | undefined) => void;
    // Hovered / selected rank on chart
    hoveredRank: number | null;
    setHoveredRank: (hoveredRank: number | null) => void;
    selectedRank: number | null;
    setSelectedRank: (selectedRank: number | null) => void;
    rankData: SerieRankData[];
    // chart reference for JPEG export
    perfChartRef: React.RefObject<HTMLDivElement>;
    // test task drawer
    drawerTestTaskKey: string | null;
    setDrawerTestTaskKey: (key: string | null) => void;
    // indexes
    getComputePlanIndex: (computePlanKey: string) => string;
    getNodeIndex: (computePlanKey: string, nodeId: string) => string;
    getSerieIndex: (computePlanKey: string, serieId: string) => string;
}

/* eslint-disable @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars */
export const PerfBrowserContext = createContext<PerfBrowserContext>({
    loading: true,
    computePlans: [],
    series: [],
    seriesGroups: [],
    nodes: [],
    colorMode: 'node',
    xAxisMode: MELLODDY ? 'epoch' : 'rank',
    setXAxisMode: (xAxisMode) => {},
    selectedNodeIds: [],
    setSelectedNodeIds: (selectedNodeIds) => {},
    isNodeIdSelected: (nodeId) => false,
    selectedComputePlanKeys: [],
    setSelectedComputePlanKeys: (selectedComputePlanKeys) => {},
    onComputePlanKeySelectionChange:
        (computePlanKey: string) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {},
    selectedMetricName: '',
    setSelectedMetricName: (name: string) => {},
    selectedSeriesGroup: [],
    highlightedSerie: undefined,
    setHighlightedSerie: (highlightedSerie) => {},
    highlightedComputePlanKey: undefined,
    setHighlightedComputePlanKey: (computePlanKey) => {},
    highlightedNodeId: undefined,
    setHighlightedNodeId: (nodeId) => {},
    hoveredRank: null,
    setHoveredRank: (hoveredRank) => {},
    selectedRank: null,
    setSelectedRank: (selectedRank) => {},
    rankData: [],
    perfChartRef: { current: null },
    drawerTestTaskKey: null,
    setDrawerTestTaskKey: (key) => {},
    getComputePlanIndex: (computePlanKey: string) => '',
    getNodeIndex: (computePlanKey: string, nodeId: string) => '',
    getSerieIndex: (computePlanKey: string, serieId: string) => '',
});
/* eslint-enable @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars */

const usePerfBrowser = (
    series: SerieT[],
    unsortedComputePlans: ComputePlanT[],
    colorMode: 'computePlan' | 'node',
    loading: boolean
): {
    context: PerfBrowserContext;
} => {
    const [selectedNodeIds, setSelectedNodeIds] = useSyncedStringArrayState(
        'selectedNodeIds',
        []
    );
    const [selectedComputePlanKeys, setSelectedComputePlanKeys] =
        useSyncedStringArrayState('selectedComputePlanKeys', []);
    const [hoveredRank, setHoveredRank] = useState<number | null>(null);
    const [selectedRank, setSelectedRank] = useState<number | null>(null);
    const [selectedMetricName, setSelectedMetricName] = useSyncedStringState(
        'selectedMetricName',
        ''
    );
    const [highlightedSerie, setHighlightedSerie] =
        useState<HighlightedSerie>();
    const [highlightedComputePlanKey, setHighlightedComputePlanKey] =
        useState<string>();
    const [highlightedNodeId, setHighlightedNodeId] = useState<string>();

    const computePlans = useMemo(() => {
        const computePlans = [...unsortedComputePlans];
        computePlans.sort(compareComputePlans);
        return computePlans;
    }, [unsortedComputePlans]);

    const isNodeIdSelected = useCallback(
        (nodeId: string): boolean =>
            selectedNodeIds.length === 0 || selectedNodeIds.includes(nodeId),
        [selectedNodeIds]
    );

    const onComputePlanKeySelectionChange =
        (computePlanKey: string) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const checked = event.target.checked;
            const selected = selectedComputePlanKeys.includes(computePlanKey);

            if (checked && !selected) {
                setSelectedComputePlanKeys([
                    ...selectedComputePlanKeys,
                    computePlanKey,
                ]);
            }

            if (!checked && selected) {
                setSelectedComputePlanKeys(
                    selectedComputePlanKeys.filter(
                        (key) => key !== computePlanKey
                    )
                );
            }
        };

    const nodes = useMemo(() => {
        const nodes = getSeriesNodes(series);
        nodes.sort(compareNodes);
        return nodes;
    }, [series]);

    // Define seriesGroups and selectedSeriesGroup
    const seriesGroups = useMemo(() => {
        const filteredSeries = series.filter(
            (serie) =>
                selectedComputePlanKeys.includes(serie.computePlanKey) &&
                isNodeIdSelected(serie.worker)
        );
        return buildSeriesGroups(filteredSeries);
    }, [series, selectedComputePlanKeys, isNodeIdSelected]);

    const selectedSeriesGroup = useMemo(() => {
        if (!selectedMetricName) {
            return [];
        }

        const groupsMatchingMetric = seriesGroups.filter(
            (series) =>
                series[0].metricName.toLowerCase() ===
                selectedMetricName.toLowerCase()
        );

        if (groupsMatchingMetric.length > 0) {
            return groupsMatchingMetric[0];
        } else {
            return [];
        }
    }, [seriesGroups, selectedMetricName]);

    useEffect(() => {
        if (computePlans.length && !selectedComputePlanKeys.length) {
            setSelectedComputePlanKeys(
                computePlans.map((computePlan) => computePlan.key)
            );
        }
    }, [computePlans.length]);

    const [xAxisMode, setXAxisMode] = useSyncedState<XAxisMode>(
        'xAxisMode',
        MELLODDY ? 'epoch' : 'rank',
        (v) => (v === 'epoch' ? 'epoch' : 'rank'),
        (v) => v
    );

    const perfChartRef = useRef<HTMLDivElement>(null);

    const rankData = useMemo(() => {
        if (selectedSeriesGroup.length === 0) {
            return [];
        }
        const getRankData = (rank: number): SerieRankData[] => {
            return selectedSeriesGroup.map((serie) => {
                // Look for rank or epoch based on X axis mode
                const point = serie.points.find((p) => p[xAxisMode] === rank);

                let perf = '-';
                if (point?.perf) {
                    perf = point.perf.toFixed(3);
                }

                return {
                    id: serie.id,
                    computePlanKey: serie.computePlanKey,
                    testTaskKey: point ? point.testTaskKey : null,
                    worker: serie.worker,
                    perf,
                };
            });
        };

        let rankData: SerieRankData[] = [];
        if (selectedRank !== null) {
            rankData = getRankData(selectedRank);
        } else if (hoveredRank !== null) {
            rankData = getRankData(hoveredRank);
        } else {
            const max =
                xAxisMode === 'rank'
                    ? getMaxRankWithPerf(selectedSeriesGroup)
                    : getMaxEpochWithPerf(selectedSeriesGroup);
            rankData = getRankData(max);
        }
        rankData.sort(compareSerieRankData);
        return rankData;
    }, [selectedSeriesGroup, hoveredRank, selectedRank, xAxisMode]);

    const [drawerTestTaskKey, setDrawerTestTaskKey] = useState<string | null>(
        null
    );

    const { getComputePlanIndex, getNodeIndex, getSerieIndex } = useMemo(() => {
        // object where keys are compute plan keys, values are the index to display
        const computePlanIndexes: Record<string, string> = {};
        // object of objects where keys are compute plan keys, values are themselves
        // objects where keys are node ids and values are the index to display
        const nodeIndexes: Record<string, Record<string, string>> = {};
        // object of objects where keys are compute plan keys, values are themselves
        // objects where keys are serie ids and values are the index to display
        const serieIndexes: Record<string, Record<string, string>> = {};

        for (const [i, computePlan] of computePlans.entries()) {
            const cpIndex = `${i + 1}`;
            computePlanIndexes[computePlan.key] = cpIndex;
            nodeIndexes[computePlan.key] = {};
            serieIndexes[computePlan.key] = {};

            const cpSeries = series.filter(
                (serie) => serie.computePlanKey === computePlan.key
            );
            const cpNodes = nodes.filter(
                (node) => !!cpSeries.find((serie) => serie.worker === node.id)
            );
            for (const [j, node] of cpNodes.entries()) {
                const nodeIndex =
                    computePlans.length === 1
                        ? `${j + 1}`
                        : `${cpIndex}.${j + 1}`;
                nodeIndexes[computePlan.key][node.id] = nodeIndex;

                const cpNodeSeries = cpSeries.filter(
                    (serie) => serie.worker === node.id
                );

                const seriesGroups = buildSeriesGroups(cpNodeSeries);
                for (const serieGroup of seriesGroups) {
                    if (serieGroup.length === 1) {
                        serieIndexes[computePlan.key][serieGroup[0].id] =
                            nodeIndex;
                    } else if (serieGroup.length > 1) {
                        serieGroup.sort(compareSeries);
                        for (const [k, serie] of serieGroup.entries()) {
                            const serieIndex = `${nodeIndex}.${k + 1}`;
                            serieIndexes[computePlan.key][serie.id] =
                                serieIndex;
                        }
                    }
                }
            }
        }

        return {
            getComputePlanIndex: (computePlanKey: string): string =>
                computePlanIndexes[computePlanKey],
            getNodeIndex: (computePlanKey: string, nodeId: string): string =>
                nodeIndexes[computePlanKey][nodeId],
            getSerieIndex: (computePlanKey: string, serieId: string): string =>
                serieIndexes[computePlanKey][serieId],
        };
    }, [computePlans, nodes, series]);

    return {
        context: {
            loading,
            // series
            series,
            seriesGroups,
            computePlans,
            nodes,
            colorMode,
            // xAxisMode
            xAxisMode,
            setXAxisMode,
            // node IDs
            selectedNodeIds,
            setSelectedNodeIds,
            isNodeIdSelected,
            // compute plan keys
            selectedComputePlanKeys,
            onComputePlanKeySelectionChange,
            setSelectedComputePlanKeys,
            // selected metric
            selectedMetricName,
            setSelectedMetricName,
            selectedSeriesGroup,
            // event: highlighted serie, compute plan or node
            highlightedSerie,
            setHighlightedSerie,
            highlightedComputePlanKey,
            setHighlightedComputePlanKey,
            highlightedNodeId,
            setHighlightedNodeId,
            // event: hovered/selected rank
            hoveredRank,
            setHoveredRank,
            selectedRank,
            setSelectedRank,
            rankData,
            // for JPEG export
            perfChartRef,
            // test task drawer
            drawerTestTaskKey,
            setDrawerTestTaskKey,
            // indexes
            getComputePlanIndex,
            getNodeIndex,
            getSerieIndex,
        },
    };
};

export default usePerfBrowser;
