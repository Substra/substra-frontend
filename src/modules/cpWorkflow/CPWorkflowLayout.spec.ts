import { computeLayout } from '@/modules/cpWorkflow/CPWorkflowLayout';
import { TaskCategory, TupleStatus } from '@/modules/tasks/TuplesTypes';

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
            status: TupleStatus.done,
            category: TaskCategory.train,
            inputs: [],
            outputs: ['out_model'],
            source_task_keys: [],
        },
        {
            key: 'b',
            rank: 1,
            worker: 'pharma2',
            status: TupleStatus.failed,
            category: TaskCategory.train,
            inputs: ['in_model'],
            outputs: [],
            source_task_keys: ['a'],
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
                x: 0,
                y: 0,
            },
        },
        {
            ...twoTasksGraph.tasks[1],
            position: {
                x: 400,
                y: 200,
            },
        },
    ],
    edges: twoTasksGraph.edges,
};

const twoTasksPlusTestTupleGraph: TaskGraphT = {
    tasks: [
        ...twoTasksGraph.tasks,
        {
            key: 'test_a',
            rank: 0,
            worker: 'pharma1',
            status: TupleStatus.done,
            category: TaskCategory.test,
            inputs: ['in_model'],
            outputs: [],
            source_task_keys: ['a'],
        },
    ],
    edges: [
        ...twoTasksGraph.edges,
        {
            source_task_key: 'a',
            source_output_name: 'out_model',
            target_task_key: 'test_a',
            target_input_name: 'in_model',
        },
    ],
};

const twoTasksPlusTestTupleLayoutedGraph: LayoutedTaskGraphT = {
    tasks: [
        {
            ...twoTasksPlusTestTupleGraph.tasks[0],
            position: {
                x: 0,
                y: 0,
            },
        },
        {
            ...twoTasksPlusTestTupleGraph.tasks[1],
            position: {
                x: 400,
                y: 370,
            },
        },
        {
            ...twoTasksPlusTestTupleGraph.tasks[2],
            position: {
                x: 60,
                y: 170,
            },
        },
    ],
    edges: twoTasksPlusTestTupleGraph.edges,
};

const compositeAndAggregateGraph: TaskGraphT = {
    tasks: [
        {
            key: 'composite_a',
            rank: 0,
            worker: 'pharma1',
            status: TupleStatus.done,
            category: TaskCategory.composite,
            inputs: [],
            outputs: ['out_head_model', 'out_trunk_model'],
            source_task_keys: [],
        },
        {
            key: 'aggregate_a',
            rank: 1,
            worker: 'pharma1',
            status: TupleStatus.failed,
            category: TaskCategory.aggregate,
            inputs: ['in_models'],
            outputs: ['out_model'],
            source_task_keys: ['composite_a'],
        },
        {
            key: 'composite_b',
            rank: 2,
            worker: 'pharma1',
            status: TupleStatus.done,
            category: TaskCategory.composite,
            inputs: ['in_head_model', 'in_trunk_model'],
            outputs: [],
            source_task_keys: ['composite_a', 'aggregate_a'],
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
                x: 0,
                y: 0,
            },
        },
        {
            ...compositeAndAggregateGraph.tasks[1],
            position: {
                x: 400,
                y: 60,
            },
        },
        {
            ...compositeAndAggregateGraph.tasks[2],
            position: {
                x: 800,
                y: 0,
            },
        },
    ],
    edges: compositeAndAggregateGraph.edges,
};

test('computeLayout', () => {
    expect(computeLayout(emptyGraph)).toStrictEqual(emptyGraph);
    expect(computeLayout(twoTasksGraph)).toStrictEqual(twoTasksLayoutedGraph);
    expect(computeLayout(twoTasksPlusTestTupleGraph)).toStrictEqual(
        twoTasksPlusTestTupleLayoutedGraph
    );
    expect(computeLayout(compositeAndAggregateGraph)).toStrictEqual(
        compositeAndAggregateLAyoutedGraph
    );
});
