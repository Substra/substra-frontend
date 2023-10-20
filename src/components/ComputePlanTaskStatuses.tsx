import { Flex } from '@chakra-ui/react';

import { getStatusCount } from '@/routes/computePlanDetails/ComputePlanUtils';
import { ComputePlanT } from '@/types/ComputePlansTypes';
import { taskStatusOrder } from '@/types/TasksTypes';

import Status from '@/components/Status';

const ComputePlanTaskStatuses = ({
    computePlan,
}: {
    computePlan: ComputePlanT;
}): JSX.Element => (
    <Flex gap="2.5" width="513px" wrap="wrap" data-cy="cp-tasks-status-tooltip">
        {taskStatusOrder.map((status) => (
            <Status
                key={status}
                status={status}
                size="sm"
                withIcon
                count={getStatusCount(computePlan, status)}
            />
        ))}
    </Flex>
);
export default ComputePlanTaskStatuses;
