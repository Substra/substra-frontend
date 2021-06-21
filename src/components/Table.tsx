/** @jsx jsx */
import React from 'react';
import styled from '@emotion/styled';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { Colors, Fonts, Spaces } from '@/assets/theme';

export const Table = styled.table`
    // the table won't be 1px wide, it'll instead be the cumulated width of all of its columns
    width: 1px;
    border-collapse: collapse;
    border-spacing: 0 ${Spaces.extraSmall};
    font-size: ${Fonts.sizes.tableContent};
    table-layout: fixed;
`;

export const Thead = styled.thead``;

export const Tbody = styled.tbody``;

interface TrProps {
    highlighted?: boolean;
}
export const Tr = styled.tr<TrProps>`
    & > td:before {
        border-color: ${({ highlighted }) =>
            highlighted
                ? `${Colors.primary} transparent`
                : 'white transparent'};
        background-color: ${({ highlighted }) =>
            highlighted ? Colors.darkerBackground : 'white'};
    }

    & > td:first-of-type:before {
        border-left-color: ${({ highlighted }) =>
            highlighted ? Colors.primary : 'transparent'};
    }

    & > td:last-of-type:before {
        border-right-color: ${({ highlighted }) =>
            highlighted ? Colors.primary : 'transparent'};
    }

    &:hover > td:before {
        border-color: ${Colors.primary} transparent;
    }

    &:hover > td:first-of-type:before {
        border-left-color: ${Colors.primary};
    }

    &:hover > td:last-of-type:before {
        border-right-color: ${Colors.primary};
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
    <tr>
        <td colSpan={nbColumns} css={emptyTdStyle}>
            No data to display
        </td>
    </tr>
);

interface CellProps {
    children: React.ReactNode;
}

const thStyles = css`
    padding-bottom: ${Spaces.extraSmall};

    & > div {
        border-width: 1px 0;
        border-style: solid;
        border-color: ${Colors.border} transparent;
        background-color: white;
        padding: ${Spaces.large} ${Spaces.medium};
        white-space: nowrap;
        font-weight: bold;
        text-align: left;
        display: flex;
        align-items: center;
        justify-content: flex-start;
    }

    &:first-of-type > div {
        border-radius: ${Spaces.medium} 0 0 ${Spaces.medium};
        border-left: 1px solid ${Colors.border};
    }

    &:last-of-type > div {
        border-radius: 0 ${Spaces.medium} ${Spaces.medium} 0;
        border-right: 1px solid ${Colors.border};
    }
`;

export const Th = ({ children, ...rest }: CellProps): JSX.Element => (
    <th css={thStyles} {...rest}>
        <div>{children}</div>
    </th>
);

const firstTabThStyles = css`
    &:first-of-type > div {
        border-top-left-radius: 0;
    }
`;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const FirstTabTh = (props: CellProps): JSX.Element => (
    <Th css={firstTabThStyles} {...props} />
);

const tdStyle = css`
    cursor: pointer;
    padding-bottom: ${Spaces.extraSmall};
    position: relative;

    &:before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: ${Spaces.extraSmall};
        border-width: 1px 0;
        border-style: solid;
        border-color: white transparent;
        background-color: white;
    }

    &:first-of-type:before {
        border-radius: ${Spaces.medium} 0 0 ${Spaces.medium};
        border-left: 1px solid white;
    }

    &:last-of-type:before {
        border-radius: 0 ${Spaces.medium} ${Spaces.medium} 0;
        border-right: 1px solid white;
    }

    & > div {
        position: relative;
        z-index: 1;
        padding: ${Spaces.medium};
        white-space: nowrap;
        text-align: left;
        overflow-x: hidden;
        text-overflow: ellipsis;
    }
`;

export const Td = ({ children, ...rest }: CellProps): JSX.Element => (
    <td css={tdStyle} {...rest}>
        <div>{children}</div>
    </td>
);

export const nameColWidth = css`
    width: 600px;
`;
export const ownerColWidth = css`
    width: 110px;
`;
export const permissionsColWidth = css`
    width: 210px;
`;
