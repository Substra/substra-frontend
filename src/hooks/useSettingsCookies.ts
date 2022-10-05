import { useBooleanCookie } from '@/hooks/useCookie';

const useSettingsCookie = (
    cookieName: string
): {
    isAccepted: boolean | undefined;
    accept: () => void;
    reject: () => void;
} => {
    const [isAccepted, setIsAccepted] = useBooleanCookie(cookieName);

    return {
        isAccepted,
        accept: () => setIsAccepted(true),
        reject: () => setIsAccepted(false),
    };
};

type AcceptanceCookieT = {
    isAccepted: boolean | undefined;
    accept: () => void;
    reject: () => void;
    title: string;
    titleLink: string;
    description: string;
};

export const useMicrosoftClarityCookie = (): AcceptanceCookieT => {
    const { isAccepted, accept, reject } = useSettingsCookie(
        'isMicrosoftClarityAccepted'
    );
    return {
        isAccepted,
        accept,
        reject,
        title: 'Microsoft clarity',
        titleLink: 'https://clarity.microsoft.com/',
        description:
            'Clarity is a free user behavior analytics tool that helps us understand how users are interacting with Substra through session replays and heatmaps.',
    };
};

export const useGoogleAnalyticsCookie = (): AcceptanceCookieT => {
    const { isAccepted, accept, reject } = useSettingsCookie(
        'isGoogleAnalyticsAccepted'
    );
    return {
        isAccepted,
        accept,
        reject,
        title: 'Google analytics',
        titleLink: 'https://analytics.google.com',
        description:
            'Google Analytics is a web analytics service that provides us statistics and basic analytical tools for SEO and marketing purposes.',
    };
};
