import { Fragment } from 'react';

import styled from '@emotion/styled';

import { Tr, Td, Tbody as ChakraTbody } from '@chakra-ui/react';
import { RiListCheck2 } from 'react-icons/ri';

import useLocationWithParams from '@/hooks/useLocationWithParams';
import { AssetType } from '@/modules/common/CommonTypes';
import { getAssetLabel } from '@/modules/common/CommonUtils';

import EmptyState from '@/components/EmptyState';

// This component removes the border bottom of cells in the last row of the table
export const Tbody = styled(ChakraTbody)`
    & > tr:last-of-type > td {
        border-bottom: none;
    }
`;

interface EmptyTrProps {
    nbColumns: number;
    asset: AssetType;
}

export const EmptyTr = ({ nbColumns, asset }: EmptyTrProps): JSX.Element => {
    const {
        params: { search: searchFilters },
        setLocationWithParams,
    } = useLocationWithParams();

    const hasFilters = !!searchFilters.find((sf) => sf.asset === asset);

    const clearAll = () => {
        const newSearchFilters = searchFilters.filter(
            (sf) => sf.asset !== asset
        );
        setLocationWithParams({ search: newSearchFilters, page: 1 });
    };

    const assetLabel = getAssetLabel(asset, { plural: true });
    return (
        <Tr>
            <Td colSpan={nbColumns} textAlign="center" paddingY="20">
                <EmptyState
                    icon={<RiListCheck2 />}
                    title="No data to display"
                    subtitle={
                        hasFilters
                            ? `There are no ${assetLabel} matching the active filters.`
                            : `There are no ${assetLabel} available to show.`
                    }
                    buttonOnClick={hasFilters ? clearAll : undefined}
                    buttonLabel={hasFilters ? 'Clear all filters' : undefined}
                />
            </Td>
        </Tr>
    );
};

export const ClickableTr = styled(Tr)`
    td {
        cursor: pointer;
    }
    &:hover td {
        background-color: var(--chakra-colors-gray-50);
    }
`;

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
