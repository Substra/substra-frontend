export enum TaskStep {
    inputsPreparation = 'prepare_inputs',
    functionDownloading = 'download_function',
    taskExecution = 'task_execution',
    outputsSaving = 'save_outputs',
}

export enum FunctionStep {
    imageBuilding = 'build_image',
    functionSaving = 'save_function',
}

export type AllStepsT = TaskStep | FunctionStep;

export type StepT<StepType extends AllStepsT = AllStepsT> = {
    step: StepType;
    duration: number; // in microseconds
};

export type StepInfoT = {
    title: string;
    color: string;
    description: string;
};

export type ExecutionRundownT<StepType extends AllStepsT = AllStepsT> = {
    execution_rundown: StepT<StepType>[];
};

export type FunctionExecutionRundownT = ExecutionRundownT<FunctionStep>;
export type TaskExecutionRundownT = ExecutionRundownT<TaskStep>;
