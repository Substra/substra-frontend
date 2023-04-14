import { Skeleton, Text, Progress, Td, VStack, Flex } from '@chakra-ui/react';

import { ColumnT } from '@/features/customColumns/CustomColumnsTypes';
import {
    GeneralColumnName,
    getColumnId,
} from '@/features/customColumns/CustomColumnsUtils';
import { ComputePlanStatus } from '@/types/ComputePlansTypes';

import Status from '@/components/Status';
import { TableSkeleton } from '@/components/table/Table';

const ComputePlanProgressSkeleton = (): JSX.Element => (
    <Skeleton>
        <VStack spacing="1">
            <Flex alignItems="center" justifyContent="space-between">
                <Status status={ComputePlanStatus.done} size="sm" />
                <Text fontSize="xs" color="gray.600">
                    foo/bar
                </Text>
            </Flex>
            <Progress
                size="xs"
                colorScheme="primary"
                hasStripe={false}
                value={100}
            />
        </VStack>
    </Skeleton>
);

type ComputePlanTrSkeletonProps = {
    computePlansCount: number;
    page: number;
    columns: ColumnT[];
};
const ComputePlanTrSkeleton = ({
    computePlansCount,
    page,
    columns,
}: ComputePlanTrSkeletonProps): JSX.Element => (
    <TableSkeleton itemCount={computePlansCount} currentPage={page}>
        <Td paddingRight="2.5">
            <Skeleton width="16px" height="16px" />
        </Td>
        <Td paddingX="2.5">
            <Skeleton width="16px" height="16px" />
        </Td>
        <Td>
            <Skeleton>
                <Text fontSize="xs" whiteSpace="nowrap">
                    Lorem ipsum dolor sit amet
                </Text>
            </Skeleton>
        </Td>
        {columns.map((column) => (
            <Td key={getColumnId(column)}>
                {column.type === 'general' &&
                column.name === GeneralColumnName.status ? (
                    <ComputePlanProgressSkeleton />
                ) : (
                    <Skeleton>
                        <Text fontSize="xs" whiteSpace="nowrap">
                            Lorem ipsum
                        </Text>
                    </Skeleton>
                )}
            </Td>
        ))}
    </TableSkeleton>
);
export default ComputePlanTrSkeleton;
