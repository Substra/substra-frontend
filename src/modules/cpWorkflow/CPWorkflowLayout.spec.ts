import { computeLayout } from '@/modules/cpWorkflow/CPWorkflowLayout';
import { TupleStatus } from '@/modules/tasks/TuplesTypes';

import { LayoutedTaskGraphT, TaskGraphT } from './CPWorkflowTypes';

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
            status: TupleStatus.done,
            inputs_specs: [],
            outputs_specs: [{ identifier: 'out_model', kind: 'ASSET_MODEL' }],
        },
        {
            key: 'b',
            rank: 1,
            worker: 'pharma2',
            status: TupleStatus.failed,
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

const twoTasksPlusPredictAndTestTupleGraph: TaskGraphT = {
    //............................
    // pharma1
    //         a --------------+
    //         |               |
    //         +-> predict_a   |
    //             |           |
    //             +-> test_a  |
    //............................
    // pharma2                 |
    //                         +-> b
    tasks: [
        ...twoTasksGraph.tasks,
        {
            key: 'predict_a',
            rank: 1,
            worker: 'pharma1',
            status: TupleStatus.done,
            inputs_specs: [{ identifier: 'in_model', kind: 'ASSET_MODEL' }],
            outputs_specs: [{ identifier: 'out_model', kind: 'ASSET_MODEL' }],
        },
        {
            key: 'test_a',
            rank: 2,
            worker: 'pharma1',
            status: TupleStatus.done,
            inputs_specs: [{ identifier: 'in_model', kind: 'ASSET_MODEL' }],
            outputs_specs: [{ identifier: 'perf', kind: 'ASSET_PERFORMANCE' }],
        },
    ],
    edges: [
        ...twoTasksGraph.edges,
        {
            source_task_key: 'a',
            source_output_identifier: 'out_model',
            target_task_key: 'predict_a',
            target_input_identifier: 'in_model',
        },
        {
            source_task_key: 'predict_a',
            source_output_identifier: 'out_model',
            target_task_key: 'test_a',
            target_input_identifier: 'in_model',
        },
    ],
};

const twoTasksPlusPredictAndTestTupleLayoutedGraph: LayoutedTaskGraphT = {
    tasks: [
        {
            ...twoTasksPlusPredictAndTestTupleGraph.tasks[0],
            position: {
                x: 0, // 0 ("in first column")
                y: 0, // 0 ("first task in the row")
            },
        },
        {
            ...twoTasksPlusPredictAndTestTupleGraph.tasks[1],
            position: {
                x: 400, // 1 * CELL_WIDTH ("task in second column")
                y: 608, // 3 * (NODE_HEIGHT+NODE_BOTTOM_MARGIN) ("3 tasks in first row = first row height") + ROW_BOTTOM_MARGIN + 0 ("first task in the row") + 8 ("uneven column top padding")
            },
        },
        {
            ...twoTasksPlusPredictAndTestTupleGraph.tasks[2],
            position: {
                x: 30, // 0 ("in first column") + PREDICT_TASK_LEFT_PADDING
                y: 190, // 1 * (NODE_HEIGHT+NODE_BOTTOM_MARGIN) ("second task in the row")
            },
        },
        {
            ...twoTasksPlusPredictAndTestTupleGraph.tasks[3],
            position: {
                x: 60, // 0 ("in first column") + PREDICT_TASK_LEFT_PADDING
                y: 380, // 2 * (NODE_HEIGHT+NODE_BOTTOM_MARGIN) ("thirsd task in the row")
            },
        },
    ],
    edges: twoTasksPlusPredictAndTestTupleGraph.edges,
};

const compositeAndAggregateGraph: TaskGraphT = {
    //............................
    // pharma1
    //         composite_a -> aggregate_a -> composite_b
    tasks: [
        {
            key: 'composite_a',
            rank: 0,
            worker: 'pharma1',
            status: TupleStatus.done,
            inputs_specs: [],
            outputs_specs: [
                { identifier: 'out_head_model', kind: 'ASSET_MODEL' },
                { identifier: 'out_trunk_model', kind: 'ASSET_MODEL' },
            ],
        },
        {
            key: 'aggregate_a',
            rank: 1,
            worker: 'pharma1',
            status: TupleStatus.failed,
            inputs_specs: [{ identifier: 'in_models', kind: 'ASSET_MODEL' }],
            outputs_specs: [{ identifier: 'out_model', kind: 'ASSET_MODEL' }],
        },
        {
            key: 'composite_b',
            rank: 2,
            worker: 'pharma1',
            status: TupleStatus.done,
            inputs_specs: [
                { identifier: 'in_head_model', kind: 'ASSET_MODEL' },
                { identifier: 'in_trunk_model', kind: 'ASSET_MODEL' },
            ],
            outputs_specs: [],
        },
    ],
    edges: [
        {
            source_task_key: 'composite_a',
            source_output_identifier: 'out_head_model',
            target_task_key: 'composite_b',
            target_input_identifier: 'in_head_model',
        },
        {
            source_task_key: 'composite_a',
            source_output_identifier: 'out_trunk_model',
            target_task_key: 'aggregate_a',
            target_input_identifier: 'in_models',
        },
        {
            source_task_key: 'aggregate_a',
            source_output_identifier: 'out_model',
            target_task_key: 'composite_b',
            target_input_identifier: 'in_trunk_model',
        },
    ],
};

const compositeAndAggregateLAyoutedGraph: LayoutedTaskGraphT = {
    tasks: [
        {
            ...compositeAndAggregateGraph.tasks[0],
            position: {
                x: 0, // 0 ("in first column")
                y: 0, // 0 ("first task in the row")
            },
        },
        {
            ...compositeAndAggregateGraph.tasks[1],
            position: {
                x: 400, // 1 * CELL_WIDTH ("task in second column")
                y: 8, // // 0 ("first task in the row") + 8 ("uneven column top padding")
            },
        },
        {
            ...compositeAndAggregateGraph.tasks[2],
            position: {
                x: 800, // 2 * CELL_WIDTH ("task in third column")
                y: 0, // 0 ("first task in the row")
            },
        },
    ],
    edges: compositeAndAggregateGraph.edges,
};

test('computeLayout', () => {
    expect(computeLayout(emptyGraph)).toStrictEqual(emptyGraph);
    expect(computeLayout(twoTasksGraph)).toStrictEqual(twoTasksLayoutedGraph);
    expect(computeLayout(twoTasksPlusPredictAndTestTupleGraph)).toStrictEqual(
        twoTasksPlusPredictAndTestTupleLayoutedGraph
    );
    expect(computeLayout(compositeAndAggregateGraph)).toStrictEqual(
        compositeAndAggregateLAyoutedGraph
    );
});
