/** @jsx jsx */
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { FirstTabTh, Td } from '@/components/Table';
import Skeleton from './Skeleton';

export const creationDateWidth = css`
    width: 190px;
`;
export const CreationDateTh = (): JSX.Element => (
    <FirstTabTh css={creationDateWidth}>Creation date</FirstTabTh>
);

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
