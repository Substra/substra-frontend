import React, { useEffect, useMemo, useState } from 'react';

import ReactFlow, {
    Background,
    useNodesState,
    useEdgesState,
    ReactFlowProvider,
    Node,
    useReactFlow,
    useStoreApi,
} from 'react-flow-renderer';

import useAppSelector from '@/hooks/useAppSelector';
import { useKeyPress } from '@/hooks/useKeyPress';
import {
    computeLayout,
    NODE_WIDTH,
    NODE_HEIGHT,
} from '@/modules/cpWorkflow/CPWorkflowLayout';
import { PositionedTaskT } from '@/modules/cpWorkflow/CPWorkflowTypes';
import makeReactFlowGraph, {
    MIN_ZOOM_LEVEL,
    MAX_ZOOM_LEVEL,
} from '@/modules/cpWorkflow/CPWorkflowUtils';
import { TaskCategory } from '@/modules/tasks/TuplesTypes';
import TaskDrawer from '@/routes/tasks/components/TaskDrawer';

import WorkflowControls from './WorkflowControls';
import TaskNode from './WorkflowTaskNode';

const nodeTypes = {
    taskNode: TaskNode,
};

const TasksWorkflow = (): JSX.Element => {
    const cpWorkflowGraph = useAppSelector((state) => state.cpWorkflow.graph);

    const layoutedGraph = useMemo(
        () => computeLayout(cpWorkflowGraph),
        [cpWorkflowGraph]
    );

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [selectedTaskKey, setSelectedTaskKey] = useState('');
    const [selectedTaskCategory, setSelectedTaskCategory] =
        useState<TaskCategory>(TaskCategory.test);
    const [currentZoom, setCurrentZoom] = useState(0.9);

    const store = useStoreApi();
    const fitViewOnInitDone = store.getState().fitViewOnInitDone;

    const { zoomTo, getZoom, fitBounds } = useReactFlow();

    useEffect(() => {
        const rfGraph = makeReactFlowGraph(layoutedGraph);
        setNodes(rfGraph.nodes);
        setEdges(rfGraph.edges);
    }, [layoutedGraph, setNodes, setEdges]);

    const onNodeClick = (e: React.MouseEvent, node: Node<PositionedTaskT>) => {
        if (node) {
            setSelectedTaskKey(node.data.key);
            setSelectedTaskCategory(node.data.category);
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
                    node.data.status === 'STATUS_DOING' ||
                    node.data.status === 'STATUS_FAILED'
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
                category={selectedTaskCategory}
                onClose={() => {
                    setSelectedTaskKey('');
                }}
                taskKey={selectedTaskKey}
                setPageTitle={false}
            />
            <ReactFlow
                defaultPosition={[0, 1000]} // default is set so that no node is visible before the initial fitView - which will occur when all nodes are loaded
                fitView={true}
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                minZoom={MIN_ZOOM_LEVEL}
                maxZoom={MAX_ZOOM_LEVEL}
                defaultZoom={MIN_ZOOM_LEVEL}
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
