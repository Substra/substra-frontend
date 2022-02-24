import { Skeleton, Text, Progress, Td, VStack, Flex } from '@chakra-ui/react';

import { ComputePlanStatus } from '@/modules/computePlans/ComputePlansTypes';

import Status from '@/components/Status';
import { TableSkeleton } from '@/components/Table';

declare const MELLODDY: boolean;

const ComputePlanProgressSkeleton = (): JSX.Element => (
    <Skeleton>
        <VStack spacing="1">
            <Flex alignItems="center" justifyContent="space-between">
                <Status status={ComputePlanStatus.done} size="sm" />
                <Text fontSize="xs" color="gray.600">
                    {MELLODDY ? 'CP56-SP-CLS-PH1' : 'foo/bar'}
                </Text>
            </Flex>
            <Progress
                size="xs"
                colorScheme="teal"
                hasStripe={false}
                value={100}
            />
        </VStack>
    </Skeleton>
);

interface ComputePlanTrSkeletonProps {
    computePlansCount: number;
    page: number;
}
const ComputePlanTrSkeleton = ({
    computePlansCount,
    page,
}: ComputePlanTrSkeletonProps): JSX.Element => (
    <TableSkeleton itemCount={computePlansCount} currentPage={page}>
        <Td paddingRight="2.5">
            <Skeleton width="16px" height="16px" />
        </Td>
        <Td paddingX="2.5">
            <Skeleton width="16px" height="16px" />
        </Td>
        <Td>
            <ComputePlanProgressSkeleton />
        </Td>
        <Td>
            <Skeleton>
                <Text fontSize="xs" whiteSpace="nowrap">
                    Lorem ipsum dolor sit amet
                </Text>
            </Skeleton>
        </Td>
        <Td>
            <Skeleton>
                <Text fontSize="xs">YYYY-MM-DD HH:MM:SS</Text>
            </Skeleton>
        </Td>
        <Td>
            <Skeleton>
                <Text fontSize="xs">YYYY-MM-DD HH:MM:SS</Text>
            </Skeleton>
        </Td>
    </TableSkeleton>
);
export default ComputePlanTrSkeleton;
