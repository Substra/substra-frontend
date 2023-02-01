import { TaskStep, StepInfoT } from './TasksTypes';

export const getStepInfo = (step: TaskStep): StepInfoT => {
    switch (step) {
        case TaskStep.imageBuilding:
            return {
                title: 'Image building',
                color: 'primary.500',
                description:
                    'If the image is present in the local Docker image registry: do nothing. If not, download the algorithm from another node if needed, and build the image.',
            };
        case TaskStep.inputsPreparation:
            return {
                title: 'Inputs preparation',
                color: 'orange.500',
                description:
                    'Get the assets (dataset, models) to the directory that will be shared with the task container.',
            };
        case TaskStep.taskExecution:
            return {
                title: 'Task execution',
                color: 'green.500',
                description:
                    'Create a compute Pod for the Algo if it does not already exist. Execute the code.',
            };
        case TaskStep.outputsSaving:
            return {
                title: 'Outputs saving',
                color: 'pink.500',
                description: 'Save performances and models.',
            };
        default:
            throw 'Unknown Task Step';
    }
};
