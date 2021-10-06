import { Tag, TagLabel, TagLeftIcon } from '@chakra-ui/react';
import {
    RiAlertLine,
    RiCheckFill,
    RiGitPullRequestLine,
    RiPlayMiniLine,
    RiTimeLine,
} from 'react-icons/ri';

import { ComputePlanStatus } from '@/modules/computePlans/ComputePlansTypes';
import { TupleStatus } from '@/modules/tasks/TuplesTypes';

const statusStyles: Record<
    string,
    { color: string; label: string; icon: React.FunctionComponent }
> = {
    done: {
        color: 'teal.500',
        label: 'Done',
        icon: () => <RiCheckFill fill="white" />,
    },
    failed: {
        color: 'red.500',
        label: 'Failed',
        icon: () => <RiAlertLine fill="white" />,
    },
    doing: {
        color: 'blue.500',
        label: 'Doing',
        icon: () => <RiPlayMiniLine fill="white" />,
    },
    waiting: {
        color: 'gray.300',
        label: 'Waiting',
        icon: () => <RiGitPullRequestLine fill="white" />,
    },
    todo: {
        color: 'gray.300',
        label: 'Todo',
        icon: () => <RiTimeLine fill="white" />,
    },
    canceled: {
        color: 'gray.500',
        label: 'Canceled',
        icon: () => <RiCheckFill fill="white" />,
    },
};
const metaStatus: Record<TupleStatus | ComputePlanStatus, string> = {
    [ComputePlanStatus.canceled]: 'canceled',
    [ComputePlanStatus.doing]: 'doing',
    [ComputePlanStatus.done]: 'done',
    [ComputePlanStatus.failed]: 'failed',
    [ComputePlanStatus.todo]: 'todo',
    [ComputePlanStatus.waiting]: 'waiting',
    [TupleStatus.canceled]: 'canceled',
    [TupleStatus.doing]: 'doing',
    [TupleStatus.done]: 'done',
    [TupleStatus.failed]: 'failed',
    [TupleStatus.todo]: 'todo',
    [TupleStatus.waiting]: 'waiting',
};

interface StatusTagProps {
    status: TupleStatus | ComputePlanStatus;
    size?: string;
    marginLeft?: string;
}

const StatusTag = ({ status, ...extraProps }: StatusTagProps): JSX.Element => {
    const { color, label, icon } = statusStyles[metaStatus[status]];
    return (
        <Tag backgroundColor={color} {...extraProps}>
            <TagLeftIcon as={icon} />
            <TagLabel color="white" marginLeft={1}>
                {label}
            </TagLabel>
        </Tag>
    );
};

export default StatusTag;
