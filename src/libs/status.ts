import { IconType } from 'react-icons';
import {
    RiAlertLine,
    RiCheckLine,
    RiIndeterminateCircleLine,
    RiPlayMiniLine,
    RiTimeLine,
} from 'react-icons/ri';

import { AssetType } from '@/modules/common/CommonTypes';
import { ComputePlanStatus } from '@/modules/computePlans/ComputePlansTypes';
import { TupleStatus } from '@/modules/tasks/TuplesTypes';

export enum StatusLabel {
    canceled = 'Canceled',
    doing = 'Doing',
    done = 'Done',
    failed = 'Failed',
    todo = 'Todo',
    waiting = 'Waiting',
}

const statusLabelByTupleStatus: Record<TupleStatus, StatusLabel> = {
    [TupleStatus.canceled]: StatusLabel.canceled,
    [TupleStatus.doing]: StatusLabel.doing,
    [TupleStatus.done]: StatusLabel.done,
    [TupleStatus.failed]: StatusLabel.failed,
    [TupleStatus.todo]: StatusLabel.todo,
    [TupleStatus.waiting]: StatusLabel.waiting,
};

const statusLabelByComputePlanStatus: Record<ComputePlanStatus, StatusLabel> = {
    [ComputePlanStatus.canceled]: StatusLabel.canceled,
    [ComputePlanStatus.doing]: StatusLabel.doing,
    [ComputePlanStatus.done]: StatusLabel.done,
    [ComputePlanStatus.failed]: StatusLabel.failed,
    [ComputePlanStatus.todo]: StatusLabel.todo,
    [ComputePlanStatus.waiting]: StatusLabel.waiting,
};

const tupleStatusByStatusLabel: Record<StatusLabel, TupleStatus> = {
    [StatusLabel.canceled]: TupleStatus.canceled,
    [StatusLabel.doing]: TupleStatus.doing,
    [StatusLabel.done]: TupleStatus.done,
    [StatusLabel.failed]: TupleStatus.failed,
    [StatusLabel.todo]: TupleStatus.todo,
    [StatusLabel.waiting]: TupleStatus.waiting,
};

const computePlanStatusByStatusLabel: Record<StatusLabel, ComputePlanStatus> = {
    [StatusLabel.canceled]: ComputePlanStatus.canceled,
    [StatusLabel.doing]: ComputePlanStatus.doing,
    [StatusLabel.done]: ComputePlanStatus.done,
    [StatusLabel.failed]: ComputePlanStatus.failed,
    [StatusLabel.todo]: ComputePlanStatus.todo,
    [StatusLabel.waiting]: ComputePlanStatus.waiting,
};

export const getStatusLabel = (
    status: TupleStatus | ComputePlanStatus
): StatusLabel => {
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
    label: StatusLabel
): ComputePlanStatus => {
    return computePlanStatusByStatusLabel[label];
};

const getTupleStatusFromLabel = (label: StatusLabel): TupleStatus => {
    return tupleStatusByStatusLabel[label];
};

export const getStatusFromLabel = (
    asset: AssetType,
    label: StatusLabel
): ComputePlanStatus | TupleStatus => {
    if (asset === 'compute_plan') {
        return getComputePlanStatusFromLabel(label);
    }
    if (
        [
            'traintuple',
            'composite_traintuple',
            'testtuple',
            'aggregatetuple',
        ].includes(asset)
    ) {
        return getTupleStatusFromLabel(label);
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
        default:
            throw 'Unknown status';
    }
};
