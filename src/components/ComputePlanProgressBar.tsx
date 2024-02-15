import { Box, HStack } from '@chakra-ui/react';

import { getStatusStyle } from '@/libs/status';
import { getStatusCount } from '@/routes/computePlanDetails/ComputePlanUtils';
import { ComputePlanT } from '@/types/ComputePlansTypes';
import { TaskStatus, taskStatusOrder } from '@/types/TasksTypes';

type ItemProps = {
    status: TaskStatus;
    count: number;
    total: number;
};
const Item = ({ status, count, total }: ItemProps): JSX.Element | null => {
    if (!count) {
        return null;
    }

    const percentage = Math.round((count / total) * 100);

    return (
        <Box
            minWidth="4px"
            flexBasis={`${percentage}%`}
            backgroundColor={getStatusStyle(status).progressColor}
        />
    );
};

type ComputePlanProgressBarProps = {
    computePlan: ComputePlanT;
};

const ComputePlanProgressBar = ({
    computePlan,
}: ComputePlanProgressBarProps): JSX.Element => {
    return (
        <HStack
            spacing="2px"
            width="100%"
            height="4px"
            justifyContent="flex-start"
            alignItems="stretch"
        >
            {!computePlan.task_count && (
                <Item
                    status={TaskStatus.waitingBuilderSlot}
                    count={1}
                    total={1}
                />
            )}
            {taskStatusOrder.map((status) => (
                <Item
                    key={status}
                    status={status}
                    count={getStatusCount(computePlan, status)}
                    total={computePlan.task_count}
                />
            ))}
        </HStack>
    );
};

export default ComputePlanProgressBar;
