import useCookie, { toBool } from '@/hooks/useCookie';

const useCookieSettings = (): {
    isClarityAccepted: boolean | undefined;
    acceptClarity: () => void;
    rejectClarity: () => void;
} => {
    const [isClarityAccepted, setIsClarityAccepted] = useCookie(
        'isClarityAccepted',
        toBool
    );

    return {
        isClarityAccepted,
        acceptClarity: () => setIsClarityAccepted(true),
        rejectClarity: () => setIsClarityAccepted(false),
    };
};

export const useGoogleAnalyticsCookieSettings = (): {
    isGoogleAnalyticsAccepted: boolean | undefined;
    acceptGoogleAnalytics: () => void;
    rejectGoogleAnalytics: () => void;
} => {
    const [isGoogleAnalyticsAccepted, setIsGoogleAnalyticsAccepted] = useCookie(
        'isGoogleAnalyticsAccepted',
        toBool
    );

    return {
        isGoogleAnalyticsAccepted,
        acceptGoogleAnalytics: () => setIsGoogleAnalyticsAccepted(true),
        rejectGoogleAnalytics: () => setIsGoogleAnalyticsAccepted(false),
    };
};
export default useCookieSettings;
