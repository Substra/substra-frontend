import { Fragment } from 'react';

import styled from '@emotion/styled';

import { Tr, Td, Tbody as ChakraTbody } from '@chakra-ui/react';
import { RiListCheck2 } from 'react-icons/ri';

import {
    getUrlSearchParams,
    useSetLocationParams,
} from '@/hooks/useLocationWithParams';
import { getAssetLabel } from '@/libs/CommonUtils';
import { AssetT } from '@/types/CommonTypes';

import EmptyState from '@/components/EmptyState';

// This component removes the border bottom of cells in the last row of the table
export const Tbody = styled(ChakraTbody)`
    & > tr:last-of-type > td {
        border-bottom: none;
    }
`;

const getHasFilters = () => {
    const urlSearchParams = getUrlSearchParams();
    const keys = urlSearchParams.keys();
    for (const key of keys) {
        if (key !== 'page' && key !== 'ordering' && urlSearchParams.get(key)) {
            return true;
        }
    }
    return false;
};

type EmptyTrProps = {
    nbColumns: number;
    asset: AssetT;
};

export const EmptyTr = ({ nbColumns, asset }: EmptyTrProps): JSX.Element => {
    const setLocationParams = useSetLocationParams();

    const clearAll = () => {
        const urlSearchParams = getUrlSearchParams();
        // urlSearchParams.keys is an iterator, so removing items from
        // urlSearchParams will mess up the for loop, missing some values.
        // The solution is to transform the iterator in a list and iter over
        // the list (not affected by later changes of urlSearchParams)
        const keys = [...urlSearchParams.keys()];
        for (const key of keys) {
            if (key !== 'page' && key !== 'ordering') {
                urlSearchParams.delete(key);
            }
        }
        urlSearchParams.set('page', '1');
        setLocationParams(urlSearchParams);
    };

    const hasFilters = getHasFilters();

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

type TableSkeletonProps = {
    children: React.ReactNode;
    currentPage: number;
    itemCount: number;
    rowHeight?: string;
};
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

export const rightBorderProps = {
    borderRight: 'none',
    backgroundImage:
        'linear-gradient(var(--chakra-colors-gray-100), var(--chakra-colors-gray-100))',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1px 100%',
    backgroundPosition: 'right',
};

export const bottomBorderProps = {
    borderBottom: 'none',
    backgroundImage:
        'linear-gradient(var(--chakra-colors-gray-100), var(--chakra-colors-gray-100))',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 1px',
    backgroundPosition: 'bottom',
};

export const bottomRightBorderProps = {
    borderBottom: 'none',
    borderRight: 'none',
    backgroundImage:
        'linear-gradient(var(--chakra-colors-gray-100), var(--chakra-colors-gray-100)), linear-gradient(var(--chakra-colors-gray-100), var(--chakra-colors-gray-100))',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundSize: '100% 1px, 1px 100%',
    backgroundPosition: 'bottom, right',
};
