/** @jsxRuntime classic */

/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';

import { AssetType } from '@/modules/common/CommonTypes';

import Pagination from '@/components/Pagination';
import { Td } from '@/components/Table';

import { Spaces } from '@/assets/theme';

const assetLabel: Record<AssetType, string> = {
    dataset: 'datasets',
    algo: 'algorithms',
    composite_algo: 'algorithms',
    aggregate_algo: 'algorithms',
    objective: 'objectives',
    aggregatetuple: 'tasks',
    traintuple: 'tasks',
    composite_traintuple: 'tasks',
    testtuple: 'tasks',
    compute_plan: 'compute plans',
};

const tdStyle = css`
    cursor: initial;

    & > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: ${Spaces.extraSmall};
        padding-bottom: ${Spaces.extraSmall};
        padding-right: 0;
    }

    &:before {
        display: none;
    }
`;

declare const PAGE_SIZE: number;

interface TablePaginationProps {
    colSpan: number;
    currentPage: number;
    asset: AssetType;
    itemCount: number;
}

const TablePagination = ({
    colSpan,
    currentPage,
    asset,
    itemCount,
}: TablePaginationProps): JSX.Element => {
    const firstIndex = Math.max((currentPage - 1) * PAGE_SIZE + 1, 0);
    const lastIndex = Math.min(currentPage * PAGE_SIZE, itemCount);
    const lastPage = Math.ceil(itemCount / PAGE_SIZE);

    return (
        <tr>
            <Td colSpan={colSpan} css={tdStyle}>
                <span>{`Showing ${firstIndex}-${lastIndex} of ${itemCount} ${assetLabel[asset]}`}</span>
                <Pagination currentPage={currentPage} lastPage={lastPage} />
            </Td>
        </tr>
    );
};
export default TablePagination;
