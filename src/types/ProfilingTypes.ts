export enum TaskStep {
    inputsPreparation = 'prepare_inputs',
    functionDownloading = 'download_function',
    taskExecution = 'task_execution',
    outputsSaving = 'save_outputs',
}

export type AllStepsT = TaskStep;

export type StepT<StepType extends TaskStep = AllStepsT> = {
    step: StepType;
    duration: number; // in microseconds
};

export type StepInfoT = {
    title: string;
    color: string;
    description: string;
};

export type ExecutionRundownT<StepType extends TaskStep = AllStepsT> = {
    execution_rundown: StepT<StepType>[];
};

export type TaskExecutionRundownT = ExecutionRundownT<TaskStep>;
