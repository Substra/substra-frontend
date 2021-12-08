import { Fragment } from 'react';

import { Tr, Td, Tbody as ChakraTbody } from '@chakra-ui/react';
import styled from '@emotion/styled';

interface EmptyTrProps {
    nbColumns: number;
}

// This component removes the border bottom of cells in the last row of the table
export const Tbody = styled(ChakraTbody)`
    & > tr:last-of-type > td {
        border-bottom: none;
    }
`;

export const EmptyTr = ({ nbColumns }: EmptyTrProps): JSX.Element => (
    <Tr>
        <Td
            colSpan={nbColumns}
            textAlign="center"
            fontSize="sm"
            color="gray.500"
        >
            No data to display
        </Td>
    </Tr>
);

export const ClickableTr = styled(Tr)`
    td {
        cursor: pointer;
    }
    &:hover td {
        background-color: var(--chakra-colors-gray-50);
    }
`;

declare const DEFAULT_PAGE_SIZE: number;

interface TableSkeletonProps {
    children: React.ReactNode;
    currentPage: number;
    itemCount: number;
    rowHeight?: string;
}
export const TableSkeleton = ({
    children,
    currentPage,
    itemCount,
    rowHeight,
}: TableSkeletonProps): JSX.Element => {
    let nbRows = DEFAULT_PAGE_SIZE;
    const lastPage = Math.ceil(itemCount / DEFAULT_PAGE_SIZE);
    // if on the last page, display one row per item on this last page
    if (currentPage === lastPage) {
        nbRows = itemCount % DEFAULT_PAGE_SIZE;
    }
    // handle the case where we don't know how many items there are (itemCount == 0)
    nbRows = nbRows || DEFAULT_PAGE_SIZE;
    return (
        <Fragment>
            {[...Array(nbRows)].map((_, index) => (
                <Tr key={index} height={rowHeight}>
                    {children}
                </Tr>
            ))}
        </Fragment>
    );
};
