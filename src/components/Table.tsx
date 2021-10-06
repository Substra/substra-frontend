/** @jsxRuntime classic */

/** @jsx jsx */
import { Fragment } from 'react';

import {
    Table as ChakraTable,
    Tr as ChakraTr,
    Thead as ChakraThead,
    Th as ChakraTh,
    Td as ChakraTd,
} from '@chakra-ui/react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';

import { Colors, Fonts, Spaces } from '@/assets/theme';

export const Table = styled(ChakraTable)`
    // the table won't be 1px wide, it'll instead be the cumulated width of all of its columns
    width: 1px;
    border-collapse: collapse;
    border-spacing: 0 ${Spaces.extraSmall};
    font-size: ${Fonts.sizes.tableContent};
    table-layout: fixed;
`;

export const Thead = styled(ChakraThead)`
    & > tr:before {
        border: none;
    }
`;

export const Th = styled(ChakraTh)`
    white-space: nowrap;
`;

interface TrProps {
    highlighted?: boolean;
}
export const Tr = styled(ChakraTr)<TrProps>`
    position: relative;
    background-color: ${({ highlighted }) =>
        highlighted ? Colors.darkerBackground : 'transparent'};

    & > td,
    & > th {
        border: none;
    }

    &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: -1px;
        border-width: 1px;
        border-style: solid;
        border-color: ${({ highlighted }) =>
            highlighted
                ? `${Colors.primary}`
                : `transparent transparent ${Colors.border}`};
    }

    &:nth-last-of-type(2):before,
    &:last-of-type:before {
        border-bottom-color: transparent;
    }

    &:not(:last-of-type) {
        cursor: pointer;
    }

    &:hover:before {
        border-color: ${Colors.primary};
    }
`;

const emptyTdStyle = css`
    border-width: 1px 0;
    border-style: solid;
    border-color: white transparent;
    background-color: white;
    padding: ${Spaces.medium};
    white-space: nowrap;
    text-align: left;
    overflow-x: hidden;
    text-overflow: ellipsis;
    border-radius: ${Spaces.medium};
    text-align: center;
`;

interface EmptyTrProps {
    nbColumns: number;
}

export const EmptyTr = ({ nbColumns }: EmptyTrProps): JSX.Element => (
    <ChakraTr>
        <ChakraTd colSpan={nbColumns} css={emptyTdStyle}>
            No data to display
        </ChakraTd>
    </ChakraTr>
);

export const nameColWidth = css`
    width: 600px;
`;
export const ownerColWidth = css`
    width: 150px;
`;
export const permissionsColWidth = css`
    width: 210px;
`;

declare const DEFAULT_PAGE_SIZE: number;

interface TableSkeletonProps {
    children: React.ReactNode;
    currentPage: number;
    itemCount: number;
}
export const TableSkeleton = ({
    children,
    currentPage,
    itemCount,
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
                <Tr key={index}>{children}</Tr>
            ))}
        </Fragment>
    );
};
