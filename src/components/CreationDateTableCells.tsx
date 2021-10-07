import { Td } from '@chakra-ui/react';

import Skeleton from '@/components/Skeleton';

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
});

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return dateFormatter.format(date);
};

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
