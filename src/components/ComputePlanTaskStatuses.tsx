import { HStack } from '@chakra-ui/react';

import { getStatusCount } from '@/routes/computePlanDetails/ComputePlanUtils';
import { ComputePlanT } from '@/types/ComputePlansTypes';

import { taskStatusOrder } from '@/components/ComputePlanProgressBar';
import Status from '@/components/Status';

const ComputePlanTaskStatuses = ({
    computePlan,
}: {
    computePlan: ComputePlanT;
}): JSX.Element => (
    <HStack spacing="2.5">
        {taskStatusOrder.map((status) => (
            <Status
                key={status}
                status={status}
                size="sm"
                withIcon
                count={getStatusCount(computePlan, status)}
            />
        ))}
    </HStack>
);
export default ComputePlanTaskStatuses;
