import { useEffect, useMemo, useState } from 'react';

import ReactFlow, {
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    ReactFlowProvider,
    PanOnScrollMode,
    Node,
} from 'react-flow-renderer';

import useAppSelector from '@/hooks/useAppSelector';
import { computeLayout } from '@/modules/cpWorkflow/CPWorkflowLayout';
import { PositionedTaskT } from '@/modules/cpWorkflow/CPWorkflowTypes';
import makeReactFlowGraph from '@/modules/cpWorkflow/CPWorkflowUtils';
import { TaskCategory } from '@/modules/tasks/TuplesTypes';
import TaskDrawer from '@/routes/tasks/components/TaskDrawer';

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

    return (
        <ReactFlowProvider>
            <TaskDrawer
                category={selectedTaskCategory}
                onClose={() => {
                    setSelectedTaskKey('');
                }}
                taskKey={selectedTaskKey}
                setPageTitle={false}
            />
            <ReactFlow
                nodeTypes={nodeTypes}
                nodes={nodes}
                edges={edges}
                minZoom={0.18}
                nodesDraggable={false}
                nodesConnectable={false}
                onNodeClick={onNodeClick}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                zoomOnScroll={true}
                panOnScroll={false}
                panOnScrollMode={PanOnScrollMode.Horizontal}
            >
                <Controls />
                <Background color="#aaa" gap={16} />
            </ReactFlow>
        </ReactFlowProvider>
    );
};

export default TasksWorkflow;
