export enum TaskStep {
    inputsPreparation = 'prepare_inputs',
    functionDownloading = 'download_function',
    taskExecution = 'task_execution',
    outputsSaving = 'save_outputs',
}

export type StepT = {
    step: TaskStep;
    duration: number; // in microseconds
};

export type StepInfoT = {
    title: string;
    color: string;
    description: string;
};

export type ExecutionRundownT = {
    execution_rundown: StepT[];
};
