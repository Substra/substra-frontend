import { useLocation } from 'wouter';

export const getUrlSearchParams = (): URLSearchParams =>
    new URLSearchParams(window.location.search);

export const useSetLocationParams = (): ((
    urlSearchParams: URLSearchParams
) => void) => {
    const [, setLocation] = useLocation();

    const setLocationParams = (urlSearchParams: URLSearchParams) => {
        setLocation(
            `${window.location.pathname}?${urlSearchParams.toString()}`,
            { replace: true }
        );
    };

    return setLocationParams;
};
