import { Edge, Node, MarkerType } from 'react-flow-renderer';

import { LayoutedTaskGraphT, PositionedTaskT } from '@/types/CPWorkflowTypes';
import { TaskStatus } from '@/types/TasksTypes';

import { NODE_WIDTH } from './CPWorkflowLayout';

export const MAX_ZOOM_LEVEL = 1;
export const MIN_ZOOM_LEVEL = 0.05;

export const NODE_BORDER_COLOR: Record<TaskStatus, string> = {
    [TaskStatus.failed]: '#F31B61',
    [TaskStatus.waitingBuilderSlot]: '#ADADAD',
    [TaskStatus.waitingParentTasks]: '#ADADAD',
    [TaskStatus.waitingExecutorSlot]: '#ADADAD',
    [TaskStatus.done]: '#2F9797',
    [TaskStatus.building]: '#0084DC',
    [TaskStatus.doing]: '#0084DC',
    [TaskStatus.canceled]: '#545454',
};

export const NODE_LABEL_COLOR: Record<TaskStatus, string> = {
    [TaskStatus.failed]: '#CB1C51',
    [TaskStatus.waitingBuilderSlot]: '#7F7F7F',
    [TaskStatus.waitingParentTasks]: '#7F7F7F',
    [TaskStatus.waitingExecutorSlot]: '#7F7F7F',
    [TaskStatus.done]: '#2D7A7A',
    [TaskStatus.building]: '#006EBD',
    [TaskStatus.doing]: '#006EBD',
    [TaskStatus.canceled]: '#373737',
};

export default function makeReactFlowGraph(graphItems: LayoutedTaskGraphT): {
    nodes: Node<PositionedTaskT>[];
    edges: Edge[];
} {
    const nodes = graphItems.tasks.map((task): Node<PositionedTaskT> => {
        return {
            id: task.key,
            type: 'taskNode',
            position: {
                x: task.position.x,
                y: task.position.y,
            },
            data: task,
            style: {
                borderRadius: '4px',
                zIndex: '3',
                width: NODE_WIDTH,
                border: `2px solid ${NODE_BORDER_COLOR[task.status]}`,
                color: NODE_LABEL_COLOR[task.status],
                background: 'white',
                cursor: 'pointer',
            },
        };
    });

    const edges: Edge[] = graphItems.edges.map((edge) => {
        return {
            id:
                edge.source_task_key +
                '.' +
                edge.source_output_identifier +
                '->' +
                edge.target_task_key +
                '.' +
                edge.target_input_identifier,
            source: edge.source_task_key,
            sourceHandle: edge.source_output_identifier,
            target: edge.target_task_key,
            targetHandle: edge.target_input_identifier,
            markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#373737',
            },
            style: {
                stroke: '#373737',
                height: '2px',
                zIndex: '1',
            },
        };
    });
    return { nodes, edges };
}
