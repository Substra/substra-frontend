import { Td } from '@chakra-ui/react';

import { formatDate } from '@/libs/utils';

import Skeleton from '@/components/Skeleton';

interface CreationDateTdProps {
    creationDate: string;
}
export const CreationDateTd = ({
    creationDate,
}: CreationDateTdProps): JSX.Element => <Td>{formatDate(creationDate)}</Td>;

export const CreationDateSkeletonTd = (): JSX.Element => (
    <Td>
        <Skeleton width={160} height={12} />
    </Td>
);
