import { computeLayout } from '@/modules/cpWorkflow/CPWorkflowLayout';
import { TaskStatus } from '@/modules/tasks/TasksTypes';

import { LayoutedTaskGraphT, TaskGraphT } from './CPWorkflowTypes';

const emptyGraph = {
    tasks: [],
    edges: [],
};

const twoTasksGraph: TaskGraphT = {
    tasks: [
        {
            key: 'a',
            rank: 0,
            worker: 'pharma1',
            status: TaskStatus.done,
            inputs: [],
            outputs: [{ id: 'out_model', kind: 'model' }],
        },
        {
            key: 'b',
            rank: 1,
            worker: 'pharma2',
            status: TaskStatus.failed,
            inputs: [{ id: 'in_model', kind: 'model' }],
            outputs: [],
        },
    ],
    edges: [
        {
            source_task_key: 'a',
            source_output_name: 'out_model',
            target_task_key: 'b',
            target_input_name: 'in_model',
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
                y: 208, // 1 * (NODE_HEIGHT+NODE_BOTTOM_MARGIN) ("1 task in first row = first row height") + ROW_BOTTOM_MARGIN + 0 ("first task in second row") + 8 ("uneven column top padding")
            },
        },
    ],
    edges: twoTasksGraph.edges,
};

const twoTasksPlusPredictAndTestTaskGraph: TaskGraphT = {
    tasks: [
        ...twoTasksGraph.tasks,
        {
            key: 'predict_a',
            rank: 1,
            worker: 'pharma1',
            status: TaskStatus.done,
            inputs: [{ id: 'in_model', kind: 'model' }],
            outputs: [{ id: 'out_model', kind: 'model' }],
        },
        {
            key: 'test_a',
            rank: 2,
            worker: 'pharma1',
            status: TaskStatus.done,
            inputs: [{ id: 'in_model', kind: 'model' }],
            outputs: [{ id: 'perf', kind: 'performance' }],
        },
    ],
    edges: [
        ...twoTasksGraph.edges,
        {
            source_task_key: 'a',
            source_output_name: 'out_model',
            target_task_key: 'predict_a',
            target_input_name: 'in_model',
        },
        {
            source_task_key: 'predict_a',
            source_output_name: 'out_model',
            target_task_key: 'test_a',
            target_input_name: 'in_model',
        },
    ],
};

const twoTasksPlusPredictAndTestTaskLayoutedGraph: LayoutedTaskGraphT = {
    tasks: [
        {
            ...twoTasksPlusPredictAndTestTaskGraph.tasks[0],
            position: {
                x: 0, // 0 ("in first column")
                y: 0, // 0 ("first task in the row")
            },
        },
        {
            ...twoTasksPlusPredictAndTestTaskGraph.tasks[1],
            position: {
                x: 400, // 1 * CELL_WIDTH ("task in second column")
                y: 548, // 3 * (NODE_HEIGHT+NODE_BOTTOM_MARGIN) ("3 tasks in first row = first row height") + ROW_BOTTOM_MARGIN + 0 ("first task in the row") + 8 ("uneven column top padding")
            },
        },
        {
            ...twoTasksPlusPredictAndTestTaskGraph.tasks[2],
            position: {
                x: 30, // 0 ("in first column") + PREDICT_TASK_LEFT_PADDING
                y: 170, // 1 * (NODE_HEIGHT+NODE_BOTTOM_MARGIN) ("second task in the row")
            },
        },
        {
            ...twoTasksPlusPredictAndTestTaskGraph.tasks[3],
            position: {
                x: 60, // 0 ("in first column") + PREDICT_TASK_LEFT_PADDING
                y: 340, // 2 * (NODE_HEIGHT+NODE_BOTTOM_MARGIN) ("thirsd task in the row")
            },
        },
    ],
    edges: twoTasksPlusPredictAndTestTaskGraph.edges,
};

const compositeAndAggregateGraph: TaskGraphT = {
    tasks: [
        {
            key: 'composite_a',
            rank: 0,
            worker: 'pharma1',
            status: TaskStatus.done,
            inputs: [],
            outputs: [
                { id: 'out_head_model', kind: 'model' },
                { id: 'out_trunk_model', kind: 'model' },
            ],
        },
        {
            key: 'aggregate_a',
            rank: 1,
            worker: 'pharma1',
            status: TaskStatus.failed,
            inputs: [{ id: 'in_models', kind: 'model' }],
            outputs: [{ id: 'out_model', kind: 'model' }],
        },
        {
            key: 'composite_b',
            rank: 2,
            worker: 'pharma1',
            status: TaskStatus.done,
            inputs: [
                { id: 'in_head_model', kind: 'model' },
                { id: 'in_trunk_model', kind: 'model' },
            ],
            outputs: [],
        },
    ],
    edges: [
        {
            source_task_key: 'composite_a',
            source_output_name: 'out_head_model',
            target_task_key: 'composite_b',
            target_input_name: 'in_head_model',
        },
        {
            source_task_key: 'composite_a',
            source_output_name: 'out_trunk_model',
            target_task_key: 'aggregate_a',
            target_input_name: 'in_models',
        },
        {
            source_task_key: 'aggregate_a',
            source_output_name: 'out_model',
            target_task_key: 'composite_b',
            target_input_name: 'in_trunk_model',
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
    expect(computeLayout(twoTasksPlusPredictAndTestTaskGraph)).toStrictEqual(
        twoTasksPlusPredictAndTestTaskLayoutedGraph
    );
    expect(computeLayout(compositeAndAggregateGraph)).toStrictEqual(
        compositeAndAggregateLAyoutedGraph
    );
});
