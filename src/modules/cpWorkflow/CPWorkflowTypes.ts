import { TaskStatus } from '@/modules/tasks/TasksTypes';

type PositionT = {
    x: number;
    y: number;
};

type PlugT = {
    id: string;
    kind: string;
};

export type WorkflowTaskT = {
    key: string;
    rank: number;
    worker: string;
    status: TaskStatus;
    inputs: PlugT[];
    outputs: PlugT[];
};

export type PositionedWorkflowTaskT = WorkflowTaskT & {
    position: PositionT;
};

type EdgeT = {
    source_task_key: string;
    source_output_name: string;
    target_task_key: string;
    target_input_name: string;
};

export type TaskGraphT = {
    tasks: WorkflowTaskT[];
    edges: EdgeT[];
};

export type LayoutedTaskGraphT = {
    tasks: PositionedWorkflowTaskT[];
    edges: EdgeT[];
};
