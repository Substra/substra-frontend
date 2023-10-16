import { LayoutedTaskGraphT, TaskGraphT } from '@/types/CPWorkflowTypes';
import { TaskStatus } from '@/types/TasksTypes';

import { computeLayout } from './CPWorkflowLayout';

const emptyGraph = {
    tasks: [],
    edges: [],
};

const twoTasksGraph: TaskGraphT = {
    //.......................
    // pharma1
    //         a ---+
    //              |
    //.......................
    // pharma2      |
    //              +-> b

    tasks: [
        {
            key: 'a',
            rank: 0,
            worker: 'pharma1',
            function_name: 'Training on MyAlgo',
            status: TaskStatus.done,
            inputs_specs: [],
            outputs_specs: [{ identifier: 'out_model', kind: 'ASSET_MODEL' }],
        },
        {
            key: 'b',
            rank: 1,
            function_name: 'Training on MyAlgo',
            worker: 'pharma2',
            status: TaskStatus.failed,
            inputs_specs: [{ identifier: 'in_model', kind: 'ASSET_MODEL' }],
            outputs_specs: [],
        },
    ],
    edges: [
        {
            source_task_key: 'a',
            source_output_identifier: 'out_model',
            target_task_key: 'b',
            target_input_identifier: 'in_model',
        },
    ],
};

const twoTasksLayoutedGraph: LayoutedTaskGraphT = {
    tasks: [
        {
            ...twoTasksGraph.tasks[0],
            position: {
                x: 0, // 0 ("in first column")
                y: 0, // 0 ("first task in the row")
            },
        },
        {
            ...twoTasksGraph.tasks[1],
            position: {
                x: 400, // 1 * CELL_WIDTH ("task in second column")
                y: 228, // 1 * (NODE_HEIGHT+NODE_BOTTOM_MARGIN) ("1 task in first row = first row height") + ROW_BOTTOM_MARGIN + 0 ("first task in second row") + 8 ("uneven column top padding")
            },
        },
    ],
    edges: twoTasksGraph.edges,
};

const singleChainGraphWithBypassingEdge: TaskGraphT = {
    //............................
    // pharma1
    //         task_a -> task_b ----> task_c
    //             |              |
    //             +--------------+
    tasks: [
        {
            key: 'task_a',
            rank: 0,
            worker: 'pharma1',
            function_name: 'Training on MyAlgo',
            status: TaskStatus.done,
            inputs_specs: [],
            outputs_specs: [
                { identifier: 'out_model_a', kind: 'ASSET_MODEL' },
                { identifier: 'out_model_b', kind: 'ASSET_MODEL' },
            ],
        },
        {
            key: 'task_b',
            rank: 1,
            worker: 'pharma1',
            function_name: 'Training on MyAlgo',
            status: TaskStatus.failed,
            inputs_specs: [{ identifier: 'in_model', kind: 'ASSET_MODEL' }],
            outputs_specs: [{ identifier: 'out_model', kind: 'ASSET_MODEL' }],
        },
        {
            key: 'task_c',
            rank: 2,
            worker: 'pharma1',
            function_name: 'Training on MyAlgo',
            status: TaskStatus.done,
            inputs_specs: [{ identifier: 'in_models', kind: 'ASSET_MODEL' }],
            outputs_specs: [],
        },
    ],
    edges: [
        {
            source_task_key: 'task_a',
            source_output_identifier: 'out_model_a',
            target_task_key: 'task_b',
            target_input_identifier: 'in_model',
        },
        {
            source_task_key: 'task_a',
            source_output_identifier: 'out_model_b',
            target_task_key: 'task_c',
            target_input_identifier: 'in_models',
        },
        {
            source_task_key: 'task_b',
            source_output_identifier: 'out_model',
            target_task_key: 'task_c',
            target_input_identifier: 'in_model',
        },
    ],
};

const singleChainLayoutedGraphWithBypassingEdge: LayoutedTaskGraphT = {
    tasks: [
        {
            ...singleChainGraphWithBypassingEdge.tasks[0],
            position: {
                x: 0, // 0 ("in first column")
                y: 0, // 0 ("first task in the row")
            },
        },
        {
            ...singleChainGraphWithBypassingEdge.tasks[1],
            position: {
                x: 400, // 1 * CELL_WIDTH ("task in second column")
                y: 8, // // 0 ("first task in the row") + 8 ("uneven column top padding")
            },
        },
        {
            ...singleChainGraphWithBypassingEdge.tasks[2],
            position: {
                x: 800, // 2 * CELL_WIDTH ("task in third column")
                y: 0, // 0 ("first task in the row")
            },
        },
    ],
    edges: singleChainGraphWithBypassingEdge.edges,
};

test('computeLayout', () => {
    expect(computeLayout(emptyGraph)).toStrictEqual(emptyGraph);
    expect(computeLayout(twoTasksGraph)).toStrictEqual(twoTasksLayoutedGraph);
    expect(computeLayout(singleChainGraphWithBypassingEdge)).toStrictEqual(
        singleChainLayoutedGraphWithBypassingEdge
    );
});
