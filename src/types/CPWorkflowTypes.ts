import { TaskStatus } from '@/types/TasksTypes';

type PositionT = {
    x: number;
    y: number;
};

type PlugT = {
    identifier: string;
    kind: string;
};

export type TaskT = {
    key: string;
    rank: number;
    function_name: string;
    worker: string;
    status: TaskStatus;
    inputs_specs: PlugT[];
    outputs_specs: PlugT[];
};

export type PositionedTaskT = TaskT & {
    position: PositionT;
};

type EdgeT = {
    source_task_key: string;
    source_output_identifier: string;
    target_task_key: string;
    target_input_identifier: string;
};

export type TaskGraphT = {
    tasks: TaskT[];
    edges: EdgeT[];
};

export type LayoutedTaskGraphT = {
    tasks: PositionedTaskT[];
    edges: EdgeT[];
};
