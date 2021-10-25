import { createContext, useContext, useCallback } from 'react';

import { HStack, Tag, TagCloseButton, TagLabel } from '@chakra-ui/react';

import { AlgoCategory } from '@/modules/algos/AlgosTypes';
import { CATEGORY_LABEL } from '@/modules/algos/AlgosUtils';
import { AssetType } from '@/modules/common/CommonTypes';

import {
    areSearchFiltersListsEqual,
    SearchFilterType,
} from '@/libs/searchFilter';

import useLocationWithParams from '@/hooks/useLocationWithParams';

interface TableFilterTagsContext {
    asset: AssetType;
}

const TableFilterTagsContext = createContext<TableFilterTagsContext>({
    asset: 'dataset',
});

interface TableFilterTagsProps {
    asset: AssetType;
    children: React.ReactNode | React.ReactNode[];
}

export const TableFilterTags = ({
    asset,
    children,
}: TableFilterTagsProps): JSX.Element => {
    const context: TableFilterTagsContext = { asset };
    return (
        <TableFilterTagsContext.Provider value={context}>
            <HStack>{children}</HStack>
        </TableFilterTagsContext.Provider>
    );
};

const useTagFilter = (assetKey: string) => {
    const { asset } = useContext(TableFilterTagsContext);
    const {
        params: { search: searchFilters },
        setLocationWithParams,
    } = useLocationWithParams();

    const isTagFilter = useCallback(
        (sf: SearchFilterType): boolean =>
            sf.asset === asset && sf.key === assetKey,
        [asset]
    );

    const tagFilters = searchFilters.filter(isTagFilter);

    const applySearchFilters = (newFilters: SearchFilterType[]) => {
        if (!areSearchFiltersListsEqual(searchFilters, newFilters)) {
            setLocationWithParams({ search: newFilters, page: 1 });
        }
    };

    return {
        searchFilters,
        isTagFilter,
        tagFilters,
        applySearchFilters,
    };
};

interface FilterTagProps {
    label: string;
    clear: () => void;
}
const FilterTag = ({ label, clear, ...props }: FilterTagProps): JSX.Element => (
    <Tag
        size="md"
        variant="outline"
        colorScheme="gray"
        backgroundColor="white"
        color="gray.800"
        boxShadow="0 0 0px 1px var(--chakra-colors-gray-100)"
        {...props}
    >
        <TagLabel>{label}</TagLabel>
        <TagCloseButton onClick={clear} />
    </Tag>
);

interface CounterFilterTagProps {
    label: string;
    assetKey: string;
}
const CounterFilterTag = ({
    label,
    assetKey,
}: CounterFilterTagProps): JSX.Element | null => {
    const {
        searchFilters,
        tagFilters,
        isTagFilter,
        applySearchFilters,
    } = useTagFilter(assetKey);

    const clear = () => {
        const newFilters = searchFilters.filter((sf) => !isTagFilter(sf));
        applySearchFilters(newFilters);
    };

    if (tagFilters.length) {
        return (
            <FilterTag
                label={`${label} (${tagFilters.length})`}
                clear={clear}
            />
        );
    }

    return null;
};

export const OwnerTableFilterTag = (): JSX.Element | null => (
    <CounterFilterTag label="Owners" assetKey="owner" />
);

export const WorkerTableFilterTag = (): JSX.Element | null => (
    <CounterFilterTag label="Workers" assetKey="worker" />
);

export const StatusTableFilterTag = (): JSX.Element | null => (
    <CounterFilterTag label="Status" assetKey="status" />
);

export const AlgoCategoryTableFilterTag = (): JSX.Element | null => {
    const {
        searchFilters,
        tagFilters,
        isTagFilter,
        applySearchFilters,
    } = useTagFilter('category');

    const clear = (value: string) => () => {
        const newFilters = searchFilters.filter(
            (sf) => !(isTagFilter(sf) && sf.value === value)
        );
        applySearchFilters(newFilters);
    };

    if (tagFilters.length) {
        return (
            <>
                {tagFilters.map((sf) => (
                    <FilterTag
                        label={CATEGORY_LABEL[sf.value as AlgoCategory]}
                        clear={clear(sf.value)}
                    />
                ))}
            </>
        );
    }

    return null;
};
