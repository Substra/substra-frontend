import { useLocation } from 'wouter';

export const getUrlSearchParams = (): URLSearchParams =>
    new URLSearchParams(window.location.search);

type SetLocationWithParams = (
    to: string,
    params: URLSearchParams,
    options?: { replace?: boolean }
) => void;

export const useLocationWithParams = (): [string, SetLocationWithParams] => {
    const [location, setLocation] = useLocation();
    const setLocationWithParams: SetLocationWithParams = (
        to,
        params,
        options
    ) => {
        setLocation(`${to}?${params.toString()}`, options);
    };
    return [location, setLocationWithParams];
};

export const useSetLocationParams = (): ((
    urlSearchParams: URLSearchParams
) => void) => {
    const [, setLocationWithParams] = useLocationWithParams();

    const setLocationParams = (urlSearchParams: URLSearchParams) => {
        setLocationWithParams(window.location.pathname, urlSearchParams, {
            replace: true,
        });
    };

    return setLocationParams;
};

export const useSetLocationPreserveParams = () => {
    const [, setLocationWithParams] = useLocationWithParams();

    const setLocationPreserveParams = (to: string): void => {
        setLocationWithParams(to, getUrlSearchParams());
    };

    return setLocationPreserveParams;
};

export const useHrefLocation = (): [string, (path: string) => void] => {
    const [location, setLocation] = useLocation();
    const setLocationParams = useSetLocationParams();

    const setHrefLocation = (path: string) => {
        if (path === location) {
            const urlSearchParams = getUrlSearchParams();
            const newUrlSearchParams = new URLSearchParams();
            newUrlSearchParams.set('page', '1');
            const ordering = urlSearchParams.get('ordering');
            if (ordering) {
                newUrlSearchParams.set('ordering', ordering);
            }
            setLocationParams(newUrlSearchParams);
        } else {
            setLocation(path);
        }
    };

    return [location, setHrefLocation];
};
