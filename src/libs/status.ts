import { IconType } from 'react-icons';
import {
    RiAlertLine,
    RiCheckLine,
    RiIndeterminateCircleLine,
    RiPlayMiniLine,
    RiQuestionLine,
    RiTimeLine,
} from 'react-icons/ri';

import { AssetType } from '@/modules/common/CommonTypes';
import {
    ComputePlanStatus,
    ComputePlanStatusDescription,
    statusDescriptionByComputePlanStatus,
} from '@/modules/computePlans/ComputePlansTypes';
import {
    statusDescriptionByTupleStatus,
    TupleStatus,
    TupleStatusDescription,
} from '@/modules/tasks/TuplesTypes';

enum ComputePlanStatusLabel {
    canceled = 'Canceled',
    doing = 'Doing',
    done = 'Done',
    failed = 'Failed',
    todo = 'Todo',
    waiting = 'Waiting',
    unknown = 'Empty',
}

enum TupleStatusLabel {
    canceled = 'Canceled',
    doing = 'Doing',
    done = 'Done',
    failed = 'Failed',
    todo = 'Todo',
    waiting = 'Waiting',
}

const statusLabelByTupleStatus: Record<TupleStatus, TupleStatusLabel> = {
    [TupleStatus.canceled]: TupleStatusLabel.canceled,
    [TupleStatus.doing]: TupleStatusLabel.doing,
    [TupleStatus.done]: TupleStatusLabel.done,
    [TupleStatus.failed]: TupleStatusLabel.failed,
    [TupleStatus.todo]: TupleStatusLabel.todo,
    [TupleStatus.waiting]: TupleStatusLabel.waiting,
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
    [ComputePlanStatus.unknown]: ComputePlanStatusLabel.unknown,
};

const tupleStatusByStatusLabel: Record<TupleStatusLabel, TupleStatus> = {
    [TupleStatusLabel.canceled]: TupleStatus.canceled,
    [TupleStatusLabel.doing]: TupleStatus.doing,
    [TupleStatusLabel.done]: TupleStatus.done,
    [TupleStatusLabel.failed]: TupleStatus.failed,
    [TupleStatusLabel.todo]: TupleStatus.todo,
    [TupleStatusLabel.waiting]: TupleStatus.waiting,
};

const computePlanStatusByStatusLabel: Record<
    ComputePlanStatusLabel,
    ComputePlanStatus
> = {
    [ComputePlanStatusLabel.canceled]: ComputePlanStatus.canceled,
    [ComputePlanStatusLabel.doing]: ComputePlanStatus.doing,
    [ComputePlanStatusLabel.done]: ComputePlanStatus.done,
    [ComputePlanStatusLabel.failed]: ComputePlanStatus.failed,
    [ComputePlanStatusLabel.todo]: ComputePlanStatus.todo,
    [ComputePlanStatusLabel.waiting]: ComputePlanStatus.waiting,
    [ComputePlanStatusLabel.unknown]: ComputePlanStatus.unknown,
};

export const getStatusLabel = (
    status: TupleStatus | ComputePlanStatus
): TupleStatusLabel | ComputePlanStatusLabel => {
    if (Object.values(TupleStatus).includes(status as TupleStatus)) {
        return statusLabelByTupleStatus[status as TupleStatus];
    }
    if (
        Object.values(ComputePlanStatus).includes(status as ComputePlanStatus)
    ) {
        return statusLabelByComputePlanStatus[status as ComputePlanStatus];
    }

    throw `Unknown status: '${status}'`;
};

const getComputePlanStatusFromLabel = (
    label: ComputePlanStatusLabel
): ComputePlanStatus => {
    return computePlanStatusByStatusLabel[label];
};

const getTupleStatusFromLabel = (label: TupleStatusLabel): TupleStatus => {
    return tupleStatusByStatusLabel[label];
};

export const getStatusDescription = (
    status: TupleStatus | ComputePlanStatus
): TupleStatusDescription | ComputePlanStatusDescription => {
    if (Object.values(TupleStatus).includes(status as TupleStatus)) {
        return statusDescriptionByTupleStatus[status as TupleStatus];
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

export const getStatusFromLabel = (
    asset: AssetType,
    label: ComputePlanStatusLabel | TupleStatusLabel
): ComputePlanStatus | TupleStatus => {
    if (asset === 'compute_plan') {
        return getComputePlanStatusFromLabel(label as ComputePlanStatusLabel);
    }
    if (
        [
            'traintuple',
            'composite_traintuple',
            'testtuple',
            'aggregatetuple',
        ].includes(asset)
    ) {
        return getTupleStatusFromLabel(label as TupleStatusLabel);
    }
    throw `Unknown asset with status: '${asset}'`;
};

interface StatusStyle {
    icon: IconType;
    tagColor: string;
    tagBackgroundColor: string;
    tagSolidColor: string;
    tagSolidBackgroundColor: string;
    progressColor: string;
}

export const getStatusStyle = (
    status: TupleStatus | ComputePlanStatus
): StatusStyle => {
    switch (status) {
        case TupleStatus.canceled:
        case ComputePlanStatus.canceled:
            return {
                icon: RiIndeterminateCircleLine,
                tagColor: 'gray.600',
                tagBackgroundColor: 'gray.100',
                tagSolidColor: 'white',
                tagSolidBackgroundColor: 'gray.500',
                progressColor: 'gray.500',
            };

        case TupleStatus.waiting:
        case ComputePlanStatus.waiting:
        case TupleStatus.todo:
        case ComputePlanStatus.todo:
            return {
                icon: RiTimeLine,
                tagColor: 'gray.500',
                tagBackgroundColor: 'gray.50',
                tagSolidColor: 'white',
                tagSolidBackgroundColor: 'gray.300',
                progressColor: 'gray.300',
            };
        case TupleStatus.doing:
        case ComputePlanStatus.doing:
            return {
                icon: RiPlayMiniLine,
                tagColor: 'blue.600',
                tagBackgroundColor: 'blue.50',
                tagSolidColor: 'white',
                tagSolidBackgroundColor: 'blue.500',
                progressColor: 'blue.500',
            };
        case TupleStatus.failed:
        case ComputePlanStatus.failed:
            return {
                icon: RiAlertLine,
                tagColor: 'red.600',
                tagBackgroundColor: 'red.50',
                tagSolidColor: 'white',
                tagSolidBackgroundColor: 'red.500',
                progressColor: 'red.500',
            };
        case TupleStatus.done:
        case ComputePlanStatus.done:
            return {
                icon: RiCheckLine,
                tagColor: 'teal.600',
                tagBackgroundColor: 'teal.50',
                tagSolidColor: 'white',
                tagSolidBackgroundColor: 'teal.500',
                progressColor: 'teal.500',
            };
        case ComputePlanStatus.unknown:
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
