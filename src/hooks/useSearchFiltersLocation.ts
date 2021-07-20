import { useLocation } from 'wouter';

import {
    buildSearchFiltersString,
    parseSearchFiltersString,
    SearchFilterType,
} from '@/libs/searchFilter';

const useSearchFiltersLocation = (): [
    string,
    SearchFilterType[],
    (
        searchFiltersOrLocation: SearchFilterType[] | string,
        searchFilters?: SearchFilterType[]
    ) => void
] => {
    const [wouterLocation, setWouterLocation] = useLocation();

    const urlSearchParams = new URLSearchParams(window.location.search);
    const searchFilters = parseSearchFiltersString(
        urlSearchParams.get('search') || ''
    );

    // This function is meant to be called 3 ways:
    // 1. setSearchFiltersLocation(location)
    // 2. setSearchFiltersLocation(searchFilters)
    // 3. setSearchFiltersLocation(location, searchFilters)
    function setSearchFiltersLocation(
        searchFiltersOrLocation: SearchFilterType[] | string,
        searchFilters?: SearchFilterType[]
    ) {
        // handle the different signatures
        let newLocation = window.location.pathname;
        let newSearchFilters = [];
        if (typeof searchFiltersOrLocation === 'string') {
            newLocation = searchFiltersOrLocation;
            newSearchFilters = searchFilters || [];
        } else {
            newSearchFilters = searchFiltersOrLocation;
        }

        // build new URL
        const urlSearchParams = new URLSearchParams(window.location.search);
        urlSearchParams.set(
            'search',
            buildSearchFiltersString(newSearchFilters)
        );
        // apply new location
        setWouterLocation(`${newLocation}?${urlSearchParams.toString()}`);
    }

    return [wouterLocation, searchFilters, setSearchFiltersLocation];
};

export default useSearchFiltersLocation;
