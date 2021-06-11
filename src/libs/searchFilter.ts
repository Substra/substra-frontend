export interface SearchFilterType {
    asset: string;
    key: string;
    value: string;
}

const AND = ',';

export const parseSearchFiltersString = (
    searchFiltersString: string
): SearchFilterType[] => {
    return searchFiltersString
        .split(AND)
        .filter((v) => !!v) // exclude empty values
        .map((filter) => {
            const [asset, key, value] = filter.split(':');
            return { asset, key, value };
        });
};

export const buildSearchFiltersString = (
    sfList: SearchFilterType[]
): string => {
    return sfList.map((sf) => `${sf.asset}:${sf.key}:${sf.value}`).join(AND);
};

export const areSearchFiltersEqual = (
    sfA: SearchFilterType,
    sfB: SearchFilterType
): boolean => {
    return (
        sfA.asset === sfB.asset &&
        sfA.key === sfB.key &&
        sfA.value === sfB.value
    );
};

export const searchFiltersListIncludes = (
    searchFiltersList: SearchFilterType[],
    searchFilter: SearchFilterType
): boolean => {
    return searchFiltersList.some((sf) =>
        areSearchFiltersEqual(sf, searchFilter)
    );
};

export const areSearchFiltersListsEqual = (
    sfListA: SearchFilterType[],
    sfListB: SearchFilterType[]
): boolean => {
    if (sfListA.length !== sfListB.length) {
        return false;
    }

    return sfListA.every((searchFilter) =>
        searchFiltersListIncludes(sfListB, searchFilter)
    );
};

export const isSearchFilter = (sf: unknown): sf is SearchFilterType => {
    if (typeof sf !== 'object') {
        return false;
    }

    return (
        (sf as SearchFilterType).asset !== undefined &&
        (sf as SearchFilterType).key !== undefined &&
        (sf as SearchFilterType).value !== undefined
    );
};

export const isSearchFiltersList = (
    sfList: unknown
): sfList is SearchFilterType[] => {
    if (!Array.isArray(sfList)) {
        return false;
    }

    return sfList.every(isSearchFilter);
};
