import React, { useEffect, useMemo, useState } from 'react';

import ReactFlow, {
    Background,
    useNodesState,
    useEdgesState,
    ReactFlowProvider,
    Node,
    Viewport,
    useReactFlow,
    useStoreApi,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useKeyPress } from '@/hooks/useKeyPress';
import {
    computeLayout,
    NODE_WIDTH,
    NODE_HEIGHT,
} from '@/routes/computePlanDetails/workflow/CPWorkflowLayout';
import makeReactFlowGraph, {
    MIN_ZOOM_LEVEL,
    MAX_ZOOM_LEVEL,
} from '@/routes/computePlanDetails/workflow/CPWorkflowUtils';
import TaskDrawer from '@/routes/tasks/components/TaskDrawer';
import { PositionedTaskT } from '@/types/CPWorkflowTypes';
import { TaskStatus } from '@/types/TasksTypes';

import useWorkflowStore from '../useWorkflowStore';
import WorkflowControls from './WorkflowControls';
import TaskNode from './WorkflowTaskNode';

const nodeTypes = {
    taskNode: TaskNode,
};

const TasksWorkflow = (): JSX.Element => {
    const { graph: cpWorkflowGraph } = useWorkflowStore();

    const layoutedGraph = useMemo(
        () => computeLayout(cpWorkflowGraph),
        [cpWorkflowGraph]
    );

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedTaskKey, setSelectedTaskKey] = useState('');
    const [currentZoom, setCurrentZoom] = useState(0.9);

    const store = useStoreApi();
    const fitViewOnInitDone = store.getState().fitViewOnInitDone;
    const defaultViewport: Viewport = { x: 0, y: 1000, zoom: MIN_ZOOM_LEVEL };
    const { zoomTo, getZoom, fitBounds } = useReactFlow();

    useEffect(() => {
        const rfGraph = makeReactFlowGraph(layoutedGraph);
        setNodes(rfGraph.nodes);
        setEdges(rfGraph.edges);
    }, [layoutedGraph, setNodes, setEdges]);

    const onNodeClick = (e: React.MouseEvent, node: Node<PositionedTaskT>) => {
        if (node) {
            setSelectedTaskKey(node.data.key);
        }
    };

    const updateZoomLevel = () => {
        const zoomLevel = getZoom();
        setCurrentZoom(zoomLevel);
    };

    const zoomOut = () => {
        const zoomLevel = getZoom() - 0.3;
        zoomTo(zoomLevel, { duration: 200 });
    };

    const zoomIn = () => {
        const zoomLevel = getZoom() + 0.3;
        zoomTo(zoomLevel, { duration: 200 });
    };

    const computeBoundingBox = (nodes: Node[]) => {
        const xMin = Math.min(...nodes.map((node) => node.position.x));
        const xMax =
            Math.max(...nodes.map((node) => node.position.x)) + NODE_WIDTH;
        const yMin = Math.min(...nodes.map((node) => node.position.y));
        const yMax =
            Math.max(...nodes.map((node) => node.position.y)) + NODE_HEIGHT;
        return {
            x: xMin,
            y: yMin,
            width: xMax - xMin,
            height: yMax - yMin,
        };
    };

    const resetZoom = () => {
        if (nodes.length) {
            let bBox;
            const failedOrDoingNodes = nodes.filter(
                (node) =>
                    node.data.status === TaskStatus.executing ||
                    node.data.status === TaskStatus.building ||
                    node.data.status === TaskStatus.failed
            );
            if (failedOrDoingNodes.length) {
                bBox = computeBoundingBox(failedOrDoingNodes);
            } else {
                const lastRank = Math.max(
                    ...nodes.map((node) => node.data.rank)
                );
                const lastRankNodes = nodes.filter(
                    (node) => node.data.rank === lastRank
                );
                bBox = computeBoundingBox(lastRankNodes);
            }

            if (bBox) {
                fitBounds(bBox, { duration: 800 });
            }
        }
    };
    useKeyPress('R', resetZoom);
    useKeyPress('r', resetZoom);
    useKeyPress('+', zoomIn);
    useKeyPress('-', zoomOut);

    // this is used to call resetZoom as soon as nodes are loaded. We don't want to
    // use resetZoom in the dependencies, as it causes the hook to run multiple times.
    useEffect(() => {
        resetZoom();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fitViewOnInitDone]);

    return (
        <div style={{ flexBasis: '100%' }}>
            <TaskDrawer
                onClose={() => {
                    setSelectedTaskKey('');
                }}
                taskKey={selectedTaskKey}
                setPageTitle={false}
            />
            <ReactFlow
                data-cy="workflow-graph"
                fitView={true}
                defaultViewport={defaultViewport}
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                minZoom={MIN_ZOOM_LEVEL}
                maxZoom={MAX_ZOOM_LEVEL}
                nodesDraggable={false}
                nodesConnectable={false}
                onNodeClick={onNodeClick}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                zoomOnScroll={true}
                attributionPosition="bottom-left"
                onMove={updateZoomLevel}
                deleteKeyCode={null}
            >
                <Background color="#aaa" gap={16} />
            </ReactFlow>
            <WorkflowControls
                resetZoom={resetZoom}
                zoomOut={zoomOut}
                zoomIn={zoomIn}
                zoomOutDisabled={currentZoom <= MIN_ZOOM_LEVEL}
                zoomInDisabled={currentZoom >= MAX_ZOOM_LEVEL}
            />
        </div>
    );
};

export default () => (
    <ReactFlowProvider>
        <TasksWorkflow />
    </ReactFlowProvider>
);
