import { Box, HStack } from '@chakra-ui/react';

import { getStatusCount } from '@/modules/computePlans/ComputePlanUtils';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';
import { TupleStatus } from '@/modules/tasks/TuplesTypes';

import { getStatusStyle } from '@/libs/status';

interface ItemProps {
    status: TupleStatus;
    count: number;
    total: number;
}
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

export const tupleStatusOrder: TupleStatus[] = [
    TupleStatus.doing,
    TupleStatus.done,
    TupleStatus.canceled,
    TupleStatus.failed,
    TupleStatus.todo,
    TupleStatus.waiting,
];

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
                <Item status={TupleStatus.waiting} count={1} total={1} />
            )}
            {tupleStatusOrder.map((status) => (
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
