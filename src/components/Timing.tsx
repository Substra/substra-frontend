import { Text } from '@chakra-ui/react';

import { shortFormatDate } from '@/libs/utils';
import {
    ComputePlanStatus,
    ComputePlanT,
} from '@/modules/computePlans/ComputePlansTypes';
import { TaskT, TaskStatus } from '@/modules/tasks/TasksTypes';

type TimingProps = {
    asset: ComputePlanT | TaskT;
};

const Timing = ({ asset }: TimingProps): JSX.Element => {
    if (!asset.start_date) {
        return (
            <Text color="gray.500">
                {[
                    ComputePlanStatus.todo,
                    ComputePlanStatus.waiting,
                    TaskStatus.todo,
                    TaskStatus.waiting,
                ].includes(asset.status)
                    ? 'Not started yet'
                    : 'Information not available'}
            </Text>
        );
    }

    return (
        <Text>
            <Text as="span">{`${shortFormatDate(asset.start_date)} -> `}</Text>
            {asset.end_date && (
                <Text as="span">{shortFormatDate(asset.end_date)}</Text>
            )}
            {!asset.end_date && (
                <Text color="gray.500" as="span">
                    {[
                        ComputePlanStatus.done,
                        ComputePlanStatus.canceled,
                        ComputePlanStatus.failed,
                        TaskStatus.done,
                        TaskStatus.canceled,
                        TaskStatus.failed,
                    ].includes(asset.status)
                        ? 'Information not available'
                        : 'Not ended yet'}
                </Text>
            )}
        </Text>
    );
};
export default Timing;
