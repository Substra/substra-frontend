import { HStack } from '@chakra-ui/react';

import { getStatusCount } from '@/modules/computePlans/ComputePlanUtils';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

import { tupleStatusOrder } from '@/components/ComputePlanProgressBar';
import Status from '@/components/Status';

const ComputePlanTaskStatuses = ({
    computePlan,
}: {
    computePlan: ComputePlanT;
}): JSX.Element => (
    <HStack spacing="2.5">
        {tupleStatusOrder.map((status) => (
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
