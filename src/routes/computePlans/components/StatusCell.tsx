import {
    Flex,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
    VStack,
} from '@chakra-ui/react';

import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

import ComputePlanProgressBar from '@/components/ComputePlanProgressBar';
import ComputePlanTaskStatuses from '@/components/ComputePlanTaskStatuses';
import Status from '@/components/Status';

type StatusCellProps = {
    computePlan: ComputePlanT;
};
const StatusCell = ({ computePlan }: StatusCellProps): JSX.Element => {
    return (
        <Popover trigger="hover" placement="bottom-start">
            <PopoverTrigger>
                <VStack spacing="1" alignItems="stretch">
                    <Flex alignItems="center" justifyContent="space-between">
                        <Status status={computePlan.status} size="sm" />
                        <Text fontSize="xs" color="gray.600">
                            {computePlan.done_count + computePlan.failed_count}/
                            {computePlan.task_count}
                        </Text>
                    </Flex>
                    <ComputePlanProgressBar computePlan={computePlan} />
                </VStack>
            </PopoverTrigger>
            <PopoverContent width="auto">
                <PopoverBody padding="2.5">
                    <ComputePlanTaskStatuses computePlan={computePlan} />
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

export default StatusCell;
