import { useLocation } from 'wouter';

import {
    buildSearchFiltersString,
    parseSearchFiltersString,
    SearchFilterType,
} from '@/libs/searchFilter';

const RADIX = 10;

interface LocationParams {
    search: SearchFilterType[];
    page: number;
    match: string;
    ordering: string;
}

interface NewLocationParams {
    search?: SearchFilterType[];
    page?: number;
    match?: string;
    ordering?: string;
}

const useLocationWithParams = (): {
    location: string;
    params: LocationParams;
    setLocationWithParams: (
        paramsOrLocation: NewLocationParams | string,
        params?: NewLocationParams
    ) => void;
    buildLocationWithParams: (
        paramsOrLocation: NewLocationParams | string,
        params?: NewLocationParams
    ) => string;
} => {
    const [location, setLocation] = useLocation();

    const urlSearchParams = new URLSearchParams(window.location.search);
    const params: LocationParams = {
        search: parseSearchFiltersString(urlSearchParams.get('search') || ''),
        page: parseInt(urlSearchParams.get('page') || '', RADIX) || 1,
        match: urlSearchParams.get('match') || '',
        ordering: urlSearchParams.get('ordering') || '',
    };

    // This function is meant to be called 3 ways:
    // 1. getLocationWithParams(location)
    // 2. getLocationWithParams(params)
    // 3. getLocationWithParams(location, params)
    function buildLocationWithParams(
        paramsOrLocation: NewLocationParams | string,
        params?: NewLocationParams
    ): string {
        // parse args
        let newLocation: string = window.location.pathname;
        let newParams: NewLocationParams = {};
        if (typeof paramsOrLocation === 'string') {
            newLocation = paramsOrLocation;
            newParams = params || {};
        } else {
            newParams = paramsOrLocation;
        }

        // build new params
        const urlSearchParams = new URLSearchParams(window.location.search);
        if (newParams.search) {
            urlSearchParams.set(
                'search',
                buildSearchFiltersString(newParams.search)
            );
        }
        if (newParams.page) {
            urlSearchParams.set('page', newParams.page.toString(RADIX));
        }
        if (newParams.ordering) {
            urlSearchParams.set('ordering', newParams.ordering);
        }

        if (newParams.match !== undefined) {
            urlSearchParams.set('match', newParams.match);
        }

        return `${newLocation}?${urlSearchParams.toString()}`;
    }

    // This function is meant to be called 3 ways:
    // 1. setLocationWithParams(location)
    // 2. setLocationWithParams(params)
    // 3. setLocationWithParams(location, params)
    function setLocationWithParams(
        paramsOrLocation: NewLocationParams | string,
        params?: NewLocationParams
    ) {
        const newLocation = buildLocationWithParams(paramsOrLocation, params);
        setLocation(newLocation);
    }

    return { location, params, setLocationWithParams, buildLocationWithParams };
};

export default useLocationWithParams;
