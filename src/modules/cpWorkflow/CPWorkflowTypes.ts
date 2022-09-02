import { TaskCategory, TupleStatus } from '@/modules/tasks/TuplesTypes';

type PositionT = {
    x: number;
    y: number;
};

export type TaskT = {
    key: string;
    rank: number;
    worker: string;
    status: TupleStatus;
    category: TaskCategory;
    inputs: string[];
    outputs: string[];
};

export type PositionedTaskT = TaskT & {
    position: PositionT;
};

type EdgeT = {
    source_task_key: string;
    source_output_name: string;
    target_task_key: string;
    target_input_name: string;
};

export type TaskGraphT = {
    tasks: TaskT[];
    edges: EdgeT[];
};

export type LayoutedTaskGraphT = {
    tasks: PositionedTaskT[];
    edges: EdgeT[];
};
