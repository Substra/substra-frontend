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

interface StatusStyle {
    colorScheme: string;
    icon: IconType;
}

export const getStatusStyle = (
    status: TupleStatus | ComputePlanStatus
): StatusStyle => {
    switch (status) {
        case TupleStatus.canceled:
        case ComputePlanStatus.canceled:
            return {
                icon: RiIndeterminateCircleLine,
                colorScheme: 'gray',
            };

        case TupleStatus.waiting:
        case ComputePlanStatus.waiting:
        case TupleStatus.todo:
        case ComputePlanStatus.todo:
            return {
                icon: RiTimeLine,
                colorScheme: 'yellow',
            };
        case TupleStatus.doing:
        case ComputePlanStatus.doing:
            return {
                icon: RiPlayMiniLine,
                colorScheme: 'blue',
            };
        case TupleStatus.failed:
        case ComputePlanStatus.failed:
            return {
                icon: RiAlertLine,
                colorScheme: 'red',
            };
        case TupleStatus.done:
        case ComputePlanStatus.done:
            return {
                icon: RiCheckLine,
                colorScheme: 'teal',
            };
        default:
            throw 'Unknown status';
    }
};

interface StatusProps {
    status: ComputePlanStatus | TupleStatus;
    size: TagProps['size'];
    variant?: TagProps['variant'];
    withIcon?: boolean;
}

const Status = ({
    status,
    size,
    variant,
    withIcon,
}: StatusProps): JSX.Element => {
    const { icon, colorScheme } = getStatusStyle(status);

    return (
        <Tag size={size} colorScheme={colorScheme} variant={variant}>
            {withIcon !== false && <TagLeftIcon as={icon} marginRight={1} />}
            <TagLabel>{getStatusLabel(status)}</TagLabel>
        </Tag>
    );
};

export default Status;
