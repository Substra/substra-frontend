import { Tooltip, TooltipProps } from '@chakra-ui/react';
import {
    RiCodeLine,
    RiDatabase2Line,
    RiCodepenLine,
    RiFocus2Line,
} from 'react-icons/ri';

import { AssetKindT } from '@/types/FunctionsTypes';
import { TaskStep, StepInfoT } from '@/types/TasksTypes';

import IconTag from '@/components/IconTag';

import { getAssetKindLabel } from '../functions/FunctionsUtils';

export const taskOrder = new Map<TaskStep, number>([
    [TaskStep.functionDownloading, 0],
    [TaskStep.inputsPreparation, 1],
    [TaskStep.taskExecution, 2],
    [TaskStep.outputsSaving, 3],
]);

export const getStepInfo = (step: TaskStep): StepInfoT => {
    switch (step) {
        case TaskStep.inputsPreparation:
            return {
                title: 'Inputs preparation',
                color: 'orange.500',
                description:
                    'Get the assets (dataset, models) to the directory that will be shared with the task container.',
            };
        case TaskStep.functionDownloading:
            return {
                title: 'Downloading function',
                color: 'primary.500',
                description:
                    'If the function image has been built on another organisation, the organisation executing the task has to download the image from this other organisation.',
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

export const TaskIOTooltip = (props: TooltipProps) => (
    <Tooltip
        fontSize="xs"
        placement="top"
        hasArrow
        shouldWrapChildren
        {...props}
    />
);

export const getTaskIOIcon = (kind: AssetKindT): JSX.Element => {
    switch (kind) {
        case AssetKindT.dataManager:
            return (
                <TaskIOTooltip label={getAssetKindLabel(kind)}>
                    <IconTag
                        icon={RiCodeLine}
                        backgroundColor="gray.100"
                        fill="gray.500"
                    />
                </TaskIOTooltip>
            );
        case AssetKindT.dataSample:
            return (
                <TaskIOTooltip label={getAssetKindLabel(kind)}>
                    <IconTag
                        icon={RiDatabase2Line}
                        backgroundColor="gray.100"
                        fill="gray.500"
                    />
                </TaskIOTooltip>
            );
        case AssetKindT.model:
            return (
                <TaskIOTooltip label={getAssetKindLabel(kind)}>
                    <IconTag
                        icon={RiCodepenLine}
                        backgroundColor="gray.100"
                        fill="gray.500"
                    />
                </TaskIOTooltip>
            );
        case AssetKindT.performance:
            return (
                <TaskIOTooltip label={getAssetKindLabel(kind)}>
                    <IconTag
                        icon={RiFocus2Line}
                        backgroundColor="gray.100"
                        fill="gray.500"
                    />
                </TaskIOTooltip>
            );
        default:
            return <></>;
    }
};
