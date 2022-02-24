import React, {
    createContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';

import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { NodeType } from '@/modules/nodes/NodesTypes';
import { HighlightedSerie, SerieT } from '@/modules/series/SeriesTypes';
import {
    buildSeriesGroups,
    getSeriesNodes,
} from '@/modules/series/SeriesUtils';

import { OnOptionChange } from '@/hooks/useSelection';

declare const MELLODDY: boolean;

type ComputePlanNodes = Record<string, Record<string, boolean>>;
export type XAxisMode = 'epoch' | 'rank';

interface PerfBrowserContext {
    loading: boolean;
    // List of all compute plans we're browsing series for
    computePlans: ComputePlanT[];
    // List of all compute plan keys sorted alphabetically
    sortedComputePlanKeys: string[];
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
    onNodeIdSelectionChange: OnOptionChange;
    // List of compute plans for which to display series (display if serie.computePlanKey is in selectedComputePlanKeys)
    selectedComputePlanKeys: string[];
    setSelectedComputePlanKeys: (selectedComputePlanKeys: string[]) => void;
    onComputePlanKeySelectionChange: OnOptionChange;
    // Dict of all node IDs per compute plan key of all series, with a selected status for each node.
    // ex: selectedComputePlanNodes[computePlanKey][nodeId] = true;
    selectedComputePlanNodes: ComputePlanNodes;
    setSelectedComputePlanNodes: (
        computePlanPlanNodes: ComputePlanNodes
    ) => void;
    onComputePlanNodeSelectionChange: (
        computePlanKey: string,
        nodeId: string
    ) => (event: React.ChangeEvent<HTMLInputElement>) => void;
    // Currently selected metric with its series
    selectedMetricName: string;
    setSelectedMetricName: (name: string) => void;
    selectedSeriesGroup: SerieT[];
    // Serie to highlight on charts
    highlightedSerie: HighlightedSerie | undefined;
    setHighlightedSerie: (
        highlightedSerie: HighlightedSerie | undefined
    ) => void;
    // Hovered / selected rank on chart
    hoveredRank: number | null;
    setHoveredRank: (hoveredRank: number | null) => void;
    selectedRank: number | null;
    setSelectedRank: (selectedRank: number | null) => void;
    // chart reference for JPEG export
    perfChartRef: React.RefObject<HTMLDivElement>;
}

/* eslint-disable @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars */
export const PerfBrowserContext = createContext<PerfBrowserContext>({
    loading: true,
    computePlans: [],
    sortedComputePlanKeys: [],
    series: [],
    seriesGroups: [],
    nodes: [],
    colorMode: 'node',
    xAxisMode: MELLODDY ? 'epoch' : 'rank',
    setXAxisMode: (xAxisMode) => {},
    selectedNodeIds: [],
    setSelectedNodeIds: (selectedNodeIds) => {},
    onNodeIdSelectionChange:
        (nodeId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {},
    selectedComputePlanKeys: [],
    setSelectedComputePlanKeys: (selectedComputePlanKeys) => {},
    onComputePlanKeySelectionChange:
        (computePlanKey: string) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {},
    selectedComputePlanNodes: {},
    setSelectedComputePlanNodes: (computePlanNodes) => {},
    onComputePlanNodeSelectionChange: (computePlanNodes) => (event) => {},
    selectedMetricName: '',
    setSelectedMetricName: (name: string) => {},
    selectedSeriesGroup: [],
    highlightedSerie: undefined,
    setHighlightedSerie: (highlightedSerie) => {},
    hoveredRank: null,
    setHoveredRank: (hoveredRank) => {},
    selectedRank: null,
    setSelectedRank: (selectedRank) => {},
    perfChartRef: { current: null },
});
/* eslint-enable @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars */

const usePerfBrowser = (
    series: SerieT[],
    computePlans: ComputePlanT[],
    colorMode: 'computePlan' | 'node',
    loading: boolean
): {
    context: PerfBrowserContext;
} => {
    const [selectedNodeIds, baseSetSelectedNodeIds] = useState<string[]>([]);
    const [selectedComputePlanKeys, setSelectedComputePlanKeys] = useState<
        string[]
    >([]);
    const [selectedComputePlanNodes, setSelectedComputePlanNodes] =
        useState<ComputePlanNodes>({});
    const [hoveredRank, setHoveredRank] = useState<number | null>(null);
    const [selectedRank, setSelectedRank] = useState<number | null>(null);
    const [selectedMetricName, setSelectedMetricName] = useState<string>('');
    const [highlightedSerie, setHighlightedSerie] =
        useState<HighlightedSerie>();

    const setSelectedNodeIds = (newSelectedNodeIds: string[]): void => {
        // update selectedNodeIds
        baseSetSelectedNodeIds(newSelectedNodeIds);

        // update selectedComputePlanNodes
        const computePlanNodesSelection: ComputePlanNodes = {};
        const added = newSelectedNodeIds.filter(
            (nodeId) => !selectedNodeIds.includes(nodeId)
        );
        const removed = selectedNodeIds.filter(
            (nodeId) => !newSelectedNodeIds.includes(nodeId)
        );
        for (const computePlanKey of Object.keys(selectedComputePlanNodes)) {
            computePlanNodesSelection[computePlanKey] = {};
            for (const nodeId of Object.keys(
                selectedComputePlanNodes[computePlanKey]
            )) {
                let selected = selectedComputePlanNodes[computePlanKey][nodeId];
                if (selected === undefined) {
                    continue;
                }
                if (added.includes(nodeId)) {
                    selected = true;
                } else if (removed.includes(nodeId)) {
                    selected = false;
                }
                computePlanNodesSelection[computePlanKey][nodeId] = selected;
            }
        }
        setSelectedComputePlanNodes(computePlanNodesSelection);
    };

    const onNodeIdSelectionChange =
        (nodeId: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
            const checked = event.target.checked;
            const selected = selectedNodeIds.includes(nodeId);

            if (checked && !selected) {
                setSelectedNodeIds([...selectedNodeIds, nodeId]);
            }

            if (!checked && selected) {
                setSelectedNodeIds(
                    selectedNodeIds.filter((id) => id !== nodeId)
                );
            }
        };

    const onComputePlanKeySelectionChange =
        (computePlanKey: string) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const checked = event.target.checked;
            const selected = selectedComputePlanKeys.includes(computePlanKey);

            const setAllComputePlanNodesSelection = () => {
                const nodesSelection: Record<string, boolean> = {};
                for (const nodeId of Object.keys(
                    selectedComputePlanNodes[computePlanKey]
                )) {
                    nodesSelection[nodeId] = checked;
                }
                setSelectedComputePlanNodes({
                    ...selectedComputePlanNodes,
                    [computePlanKey]: nodesSelection,
                });
            };

            if (checked && !selected) {
                setSelectedComputePlanKeys([
                    ...selectedComputePlanKeys,
                    computePlanKey,
                ]);
                setAllComputePlanNodesSelection();
            }

            if (!checked && selected) {
                setSelectedComputePlanKeys(
                    selectedComputePlanKeys.filter(
                        (key) => key !== computePlanKey
                    )
                );
                setAllComputePlanNodesSelection();
            }
        };

    const onComputePlanNodeSelectionChange =
        (computePlanKey: string, nodeId: string) =>
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const checked = event.target.checked;

            setSelectedComputePlanNodes({
                ...selectedComputePlanNodes,
                [computePlanKey]: {
                    ...selectedComputePlanNodes[computePlanKey],
                    [nodeId]: checked,
                },
            });
        };

    const nodes = useMemo(() => getSeriesNodes(series), [series]);

    // Define seriesGroups and selectedSeriesGroup
    const seriesGroups = useMemo(() => {
        const filteredSeries = series.filter(
            (serie) =>
                selectedComputePlanKeys.includes(serie.computePlanKey) &&
                selectedNodeIds.includes(serie.worker) &&
                !!selectedComputePlanNodes[serie.computePlanKey] &&
                selectedComputePlanNodes[serie.computePlanKey][serie.worker]
        );
        return buildSeriesGroups(filteredSeries);
    }, [
        series,
        selectedComputePlanKeys,
        selectedNodeIds,
        selectedComputePlanNodes,
    ]);

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
        if (nodes.length) {
            baseSetSelectedNodeIds(nodes.map((node) => node.id));
        }
    }, [nodes.length]);

    useEffect(() => {
        if (computePlans.length) {
            setSelectedComputePlanKeys(
                computePlans.map((computePlan) => computePlan.key)
            );
        }
    }, [computePlans.length]);

    useEffect(() => {
        if (computePlans.length > 0 && series.length > 0) {
            const computePlanNodes: ComputePlanNodes = {};
            for (const computePlan of computePlans) {
                computePlanNodes[computePlan.key] = {};
                for (const serie of series.filter(
                    (serie) => serie.computePlanKey === computePlan.key
                )) {
                    computePlanNodes[computePlan.key][serie.worker] = true;
                }
            }
            setSelectedComputePlanNodes(computePlanNodes);
        }
    }, [series.length, computePlans.length]);

    const sortedComputePlanKeys = useMemo(() => {
        const keys = computePlans.map((computePlan) => computePlan.key);
        keys.sort();
        return keys;
    }, [computePlans]);

    const [xAxisMode, setXAxisMode] = useState<XAxisMode>(
        MELLODDY ? 'epoch' : 'rank'
    );

    const perfChartRef = useRef<HTMLDivElement>(null);

    return {
        context: {
            loading,
            // series
            series,
            seriesGroups,
            computePlans,
            sortedComputePlanKeys,
            nodes,
            colorMode,
            // xAxisMode
            xAxisMode,
            setXAxisMode,
            // node IDs
            selectedNodeIds,
            onNodeIdSelectionChange,
            setSelectedNodeIds,
            // compute plan keys
            selectedComputePlanKeys,
            onComputePlanKeySelectionChange,
            setSelectedComputePlanKeys,
            // compute plan nodes
            selectedComputePlanNodes,
            setSelectedComputePlanNodes,
            onComputePlanNodeSelectionChange,
            // selected metric
            selectedMetricName,
            setSelectedMetricName,
            selectedSeriesGroup,
            // event: highlighted serie
            highlightedSerie,
            setHighlightedSerie,
            // event: hovered/selected rank
            hoveredRank,
            setHoveredRank,
            selectedRank,
            setSelectedRank,
            // for JPEG export
            perfChartRef,
        },
    };
};

export default usePerfBrowser;
