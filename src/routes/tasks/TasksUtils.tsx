import { Tooltip, TooltipProps } from '@chakra-ui/react';
import {
    RiCodeLine,
    RiDatabase2Line,
    RiCodepenLine,
    RiFocus2Line,
} from 'react-icons/ri';

import { AssetKindT } from '@/types/FunctionsTypes';
import { TaskStep, StepInfoT } from '@/types/ProfilingTypes';

import IconTag from '@/components/IconTag';

import { getAssetKindLabel } from '../functions/FunctionsUtils';

// Order is used for ordering tasks
export const taskStepsInfo: Record<TaskStep, StepInfoT> = {
    [TaskStep.functionDownloading]: {
        title: 'Downloading function',
        color: 'primary.500',
        description:
            'If the function image has been built on another organisation, the organisation executing the task has to download the image from this other organisation.',
    },
    [TaskStep.inputsPreparation]: {
        title: 'Inputs preparation',
        color: 'orange.500',
        description:
            'Get the assets (dataset, models) to the directory that will be shared with the task container.',
    },
    [TaskStep.taskExecution]: {
        title: 'Task execution',
        color: 'green.500',
        description:
            'Create a compute Pod for the Algo if it does not already exist. Execute the code.',
    },
    [TaskStep.outputsSaving]: {
        title: 'Outputs saving',
        color: 'pink.500',
        description: 'Save performances and models.',
    },
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
