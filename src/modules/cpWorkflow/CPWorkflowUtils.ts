import { Edge, Node, MarkerType } from 'react-flow-renderer';

import {
    LayoutedTaskGraphT,
    PositionedTaskT,
} from '@/modules/cpWorkflow/CPWorkflowTypes';
import { TupleStatus } from '@/modules/tasks/TuplesTypes';

import { NODE_WIDTH } from './CPWorkflowLayout';

export const MAX_ZOOM_LEVEL = 1;
export const MIN_ZOOM_LEVEL = 0.05;

export const NODE_BORDER_COLOR: Record<TupleStatus, string> = {
    [TupleStatus.failed]: '#F31B61',
    [TupleStatus.waiting]: '#ADADAD',
    [TupleStatus.done]: '#2F9797',
    [TupleStatus.todo]: '#ADADAD',
    [TupleStatus.doing]: '#0084DC',
    [TupleStatus.canceled]: '#545454',
};

export const NODE_LABEL_COLOR: Record<TupleStatus, string> = {
    [TupleStatus.failed]: '#CB1C51',
    [TupleStatus.waiting]: '#7F7F7F',
    [TupleStatus.done]: '#2D7A7A',
    [TupleStatus.todo]: '#7F7F7F',
    [TupleStatus.doing]: '#006EBD',
    [TupleStatus.canceled]: '#373737',
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
                edge.source_output_name +
                '->' +
                edge.target_task_key +
                '.' +
                edge.target_input_name,
            source: edge.source_task_key,
            sourceHandle: edge.source_output_name,
            target: edge.target_task_key,
            targetHandle: edge.target_input_name,
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
