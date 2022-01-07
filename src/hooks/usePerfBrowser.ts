import React, { createContext, useEffect, useState } from 'react';

import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { NodeType } from '@/modules/nodes/NodesTypes';
import { SerieT } from '@/modules/series/SeriesTypes';
import { getSeriesNodes } from '@/modules/series/SeriesUtils';

import { OnOptionChange } from '@/hooks/useSelection';

type ComputePlanNodes = Record<string, Record<string, boolean>>;

interface PerfBrowserContext {
    loading: boolean;
    // List of all compute plans we're browsing series for
    computePlans: ComputePlanT[];
    // List of all compute plan keys sorted alphabetically
    sortedComputePlanKeys: string[];
    // List of all the series that can be extracted from the computePlans
    series: SerieT[];
    // List of the nodes references by all the series
    nodes: NodeType[];
    // How colors should be determined
    colorMode: 'computePlan' | 'node';
    // Whether to display an average serie on charts with more than one line
    displayAverage: boolean;
    setDisplayAverage: (displayAverage: boolean) => void;
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
}

/* eslint-disable @typescript-eslint/no-empty-function,@typescript-eslint/no-unused-vars */
export const PerfBrowserContext = createContext<PerfBrowserContext>({
    loading: true,
    computePlans: [],
    sortedComputePlanKeys: [],
    series: [],
    nodes: [],
    colorMode: 'node',
    displayAverage: false,
    setDisplayAverage: (displayAverage) => {},
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
    const [displayAverage, setDisplayAverage] = useState(false);
    const [selectedNodeIds, baseSetSelectedNodeIds] = useState<string[]>([]);
    const [selectedComputePlanKeys, setSelectedComputePlanKeys] = useState<
        string[]
    >([]);
    const [selectedComputePlanNodes, setSelectedComputePlanNodes] =
        useState<ComputePlanNodes>({});

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

    const nodes = getSeriesNodes(series);

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

    const sortedComputePlanKeys = computePlans.map(
        (computePlan) => computePlan.key
    );
    sortedComputePlanKeys.sort();

    return {
        context: {
            loading,
            series,
            computePlans,
            sortedComputePlanKeys,
            nodes,
            colorMode,
            // average
            displayAverage,
            setDisplayAverage,
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
        },
    };
};

export default usePerfBrowser;
