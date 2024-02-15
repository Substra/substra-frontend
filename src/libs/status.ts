import { IconType } from 'react-icons';
import {
    RiAlertLine,
    RiCheckLine,
    RiIndeterminateCircleLine,
    RiPlayMiniLine,
    RiQuestionLine,
    RiTimeLine,
} from 'react-icons/ri';

import {
    ComputePlanStatus,
    ComputePlanStatusDescription,
    statusDescriptionByComputePlanStatus,
} from '@/types/ComputePlansTypes';
import {
    statusDescriptionByTaskStatus,
    TaskStatus,
    TaskStatusDescription,
} from '@/types/TasksTypes';

enum ComputePlanStatusLabel {
    canceled = 'Canceled',
    doing = 'Doing',
    done = 'Done',
    failed = 'Failed',
    todo = 'Todo',
    waiting = 'Waiting',
    empty = 'Empty',
}

enum TaskStatusLabel {
    canceled = 'Canceled',
    doing = 'Doing',
    done = 'Done',
    failed = 'Failed',
    waitingParentTasks = 'Waiting parents',
    waitingExecutorSlot = 'Waiting executor slot',
    waitingBuilderSlot = 'Waiting builder slot',
    building = 'Building'
}

const statusLabelByTaskStatus: Record<TaskStatus, TaskStatusLabel> = {
    [TaskStatus.canceled]: TaskStatusLabel.canceled,
    [TaskStatus.doing]: TaskStatusLabel.doing,
    [TaskStatus.done]: TaskStatusLabel.done,
    [TaskStatus.failed]: TaskStatusLabel.failed,
    [TaskStatus.waitingParentTasks]: TaskStatusLabel.waitingParentTasks,
    [TaskStatus.waitingExecutorSlot]: TaskStatusLabel.waitingExecutorSlot,
    [TaskStatus.waitingBuilderSlot]: TaskStatusLabel.waitingBuilderSlot,
    [TaskStatus.building]: TaskStatusLabel.building,
};

const statusLabelByComputePlanStatus: Record<
    ComputePlanStatus,
    ComputePlanStatusLabel
> = {
    [ComputePlanStatus.canceled]: ComputePlanStatusLabel.canceled,
    [ComputePlanStatus.doing]: ComputePlanStatusLabel.doing,
    [ComputePlanStatus.done]: ComputePlanStatusLabel.done,
    [ComputePlanStatus.failed]: ComputePlanStatusLabel.failed,
    [ComputePlanStatus.todo]: ComputePlanStatusLabel.todo,
    [ComputePlanStatus.waiting]: ComputePlanStatusLabel.waiting,
    [ComputePlanStatus.empty]: ComputePlanStatusLabel.empty,
};

export const getStatusLabel = (
    status: TaskStatus | ComputePlanStatus
): TaskStatusLabel | ComputePlanStatusLabel | string => {
    if (Object.values(TaskStatus).includes(status as TaskStatus)) {
        return statusLabelByTaskStatus[status as TaskStatus];
    }
    if (
        Object.values(ComputePlanStatus).includes(status as ComputePlanStatus)
    ) {
        return statusLabelByComputePlanStatus[status as ComputePlanStatus];
    }

    return status as string;
};

export const getStatusDescription = (
    status: TaskStatus | ComputePlanStatus
): TaskStatusDescription | ComputePlanStatusDescription => {
    if (Object.values(TaskStatus).includes(status as TaskStatus)) {
        return statusDescriptionByTaskStatus[status as TaskStatus];
    }

    if (
        Object.values(ComputePlanStatus).includes(status as ComputePlanStatus)
    ) {
        return statusDescriptionByComputePlanStatus[
            status as ComputePlanStatus
        ];
    }

    throw `Unknown status: '${status}'`;
};

type StatusStyleProps = {
    icon: IconType;
    tagColor: string;
    tagBackgroundColor: string;
    tagSolidColor: string;
    tagSolidBackgroundColor: string;
    progressColor: string;
};

export const getStatusStyle = (
    status: TaskStatus | ComputePlanStatus
): StatusStyleProps => {
    switch (status) {
        case TaskStatus.canceled:
        case ComputePlanStatus.canceled:
            return {
                icon: RiIndeterminateCircleLine,
                tagColor: 'gray.600',
                tagBackgroundColor: 'gray.100',
                tagSolidColor: 'white',
                tagSolidBackgroundColor: 'gray.500',
                progressColor: 'gray.500',
            };

        case TaskStatus.waitingBuilderSlot:
        case TaskStatus.waitingParentTasks:
        case TaskStatus.waitingExecutorSlot:
        case ComputePlanStatus.waiting:
        case ComputePlanStatus.todo:
            return {
                icon: RiTimeLine,
                tagColor: 'gray.500',
                tagBackgroundColor: 'gray.50',
                tagSolidColor: 'white',
                tagSolidBackgroundColor: 'gray.300',
                progressColor: 'gray.300',
            };
        case TaskStatus.doing:
            case TaskStatus.building:
        case ComputePlanStatus.doing:
            return {
                icon: RiPlayMiniLine,
                tagColor: 'blue.600',
                tagBackgroundColor: 'blue.50',
                tagSolidColor: 'white',
                tagSolidBackgroundColor: 'blue.500',
                progressColor: 'blue.500',
            };
        case TaskStatus.failed:
        case ComputePlanStatus.failed:
            return {
                icon: RiAlertLine,
                tagColor: 'red.600',
                tagBackgroundColor: 'red.50',
                tagSolidColor: 'white',
                tagSolidBackgroundColor: 'red.500',
                progressColor: 'red.500',
            };
        case TaskStatus.done:
        case ComputePlanStatus.done:
            return {
                icon: RiCheckLine,
                tagColor: 'teal.600',
                tagBackgroundColor: 'teal.50',
                tagSolidColor: 'white',
                tagSolidBackgroundColor: 'teal.500',
                progressColor: 'teal.500',
            };
        case ComputePlanStatus.empty:
            return {
                icon: RiQuestionLine,
                tagColor: 'gray.500',
                tagBackgroundColor: 'gray.50',
                tagSolidColor: 'white',
                tagSolidBackgroundColor: 'gray.300',
                progressColor: 'gray.300',
            };

        default:
            throw 'Unknown status';
    }
};
