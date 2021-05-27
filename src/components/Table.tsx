/** @jsx jsx */
import React from 'react';
import styled from '@emotion/styled';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { Colors, Fonts, Spaces } from '@/assets/theme';

export const Table = styled.table`
    border-collapse: collapse;
    border-spacing: 0 ${Spaces.extraSmall};
    font-size: ${Fonts.sizes.tableContent};
`;

export const Thead = styled.thead``;

export const Tbody = styled.tbody``;

export const Tr = styled.tr`
    &:hover > td > div {
        border-color: ${Colors.primary} transparent;
    }

    &:hover > td:first-of-type > div {
        border-left-color: ${Colors.primary};
    }

    &:hover > td:last-of-type > div {
        border-right-color: ${Colors.primary};
    }
`;

interface CellProps {
    children: React.ReactNode;
}

const thStyles = css`
    & > div {
        border-width: 1px 0;
        border-style: solid;
        border-color: ${Colors.border} transparent;
        background-color: white;
        padding: ${Spaces.large} ${Spaces.medium};
        white-space: nowrap;
        font-weight: bold;
        text-align: left;
        margin-bottom: ${Spaces.extraSmall};
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
export const FirstTabTh = (props): JSX.Element => (
    <Th css={firstTabThStyles} {...props} />
);

const tdStyle = css`
    cursor: pointer;

    & > div {
        border-width: 1px 0;
        border-style: solid;
        border-color: white transparent;
        background-color: white;
        padding: ${Spaces.medium};
        white-space: nowrap;
        text-align: left;
        margin-bottom: ${Spaces.extraSmall};
    }

    &:first-of-type > div {
        border-radius: ${Spaces.medium} 0 0 ${Spaces.medium};
        border-left: 1px solid white;
    }

    &:last-of-type > div {
        border-radius: 0 ${Spaces.medium} ${Spaces.medium} 0;
        border-right: 1px solid white;
    }
`;

export const Td = ({ children, ...rest }: CellProps): JSX.Element => (
    <td css={tdStyle} {...rest}>
        <div>{children}</div>
    </td>
);
