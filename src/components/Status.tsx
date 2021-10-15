import { Tag, TagLabel, TagLeftIcon, TagProps } from '@chakra-ui/react';
import { IconType } from 'react-icons';
import {
    RiAlertLine,
    RiCheckLine,
    RiIndeterminateCircleLine,
    RiPlayMiniLine,
    RiTimeLine,
} from 'react-icons/ri';

import { ComputePlanStatus } from '@/modules/computePlans/ComputePlansTypes';
import { TupleStatus } from '@/modules/tasks/TuplesTypes';

import { getStatusLabel } from '@/libs/status';

interface StatusProps {
    status: ComputePlanStatus | TupleStatus;
    size: TagProps['size'];
}

const Status = ({ status, size }: StatusProps): JSX.Element => {
    let colorScheme = '';
    let icon: IconType | undefined = undefined;

    switch (status) {
        case TupleStatus.canceled:
        case ComputePlanStatus.canceled:
            icon = RiIndeterminateCircleLine;
            colorScheme = 'gray';
            break;
        case TupleStatus.waiting:
        case ComputePlanStatus.waiting:
        case TupleStatus.todo:
        case ComputePlanStatus.todo:
            icon = RiTimeLine;
            colorScheme = 'yellow';
            break;
        case TupleStatus.doing:
        case ComputePlanStatus.doing:
            icon = RiPlayMiniLine;
            colorScheme = 'blue';
            break;
        case TupleStatus.failed:
        case ComputePlanStatus.failed:
            icon = RiAlertLine;
            colorScheme = 'red';
            break;
        case TupleStatus.done:
        case ComputePlanStatus.done:
            icon = RiCheckLine;
            colorScheme = 'green';
            break;
        default:
            break;
    }

    return (
        <Tag size={size} colorScheme={colorScheme}>
            <TagLeftIcon as={icon} />
            <TagLabel>{getStatusLabel(status)}</TagLabel>
        </Tag>
    );
};

export default Status;
