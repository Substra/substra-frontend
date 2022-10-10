import { TaskStatus } from '@/modules/tasks/TasksTypes';

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
    worker: string;
    status: TaskStatus;
    inputs_specs: PlugT[];
    outputs_specs: PlugT[];
};

type PositionedTaskT = TaskT & {
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
