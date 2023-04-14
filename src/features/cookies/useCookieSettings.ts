import useCookie, { toBool } from '@/features/cookies/useCookie';

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
export default useCookieSettings;
