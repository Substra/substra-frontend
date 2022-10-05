import { useState } from 'react';

import {
    Box,
    Button,
    Flex,
    Heading,
    HStack,
    Icon,
    Link,
    Switch,
    Text,
    VStack,
} from '@chakra-ui/react';
import { RiExternalLinkLine } from 'react-icons/ri';

import {
    useGoogleAnalyticsCookie,
    useMicrosoftClarityCookie,
} from '@/hooks/useSettingsCookies';
import useEffectOnce from '@/hooks/useEffectOnce';
import { useToast } from '@/hooks/useToast';
import NotFound from '@/routes/notfound/NotFound';
import { useBooleanCookie } from '@/hooks/useCookie';

type CookieCardProps = {
    title: string;
    titleLink: string;
    description: string;
    isChecked: boolean;
    setIsChecked: (checked: boolean) => void;
    isDisabled: boolean;
};
const CookieCard = ({
    title,
    titleLink,
    description,
    isChecked,
    setIsChecked,
    isDisabled,
}: CookieCardProps): JSX.Element => (
    <HStack
        background="gray.50"
        padding="4"
        spacing="5"
        alignItems="flex-start"
    >
        <Heading as="h4" size="xs" fontSize="sm" whiteSpace="nowrap">
            <Link href={titleLink} isExternal>
                {title}
                <Icon
                    as={RiExternalLinkLine}
                    marginLeft="2.5"
                    fill="primary.600"
                />
            </Link>
        </Heading>
        <Text fontSize="xs">{description}</Text>
        <Switch
            size="sm"
            colorScheme="primary"
            isChecked={isChecked}
            isDisabled={isDisabled}
            onChange={() => setIsChecked(!isChecked)}
        />
    </HStack>
);

const Settings = (): JSX.Element => {
    const toast = useToast();
    const [displayNotification, setDisplayNotification] = useBooleanCookie(
        'displaySavedSettingsNotification'
    );
    const microsoftClarity = useMicrosoftClarityCookie();
    const googleAnalytics = useGoogleAnalyticsCookie();

    const [microsoftClarityChecked, setMicrosoftClarityChecked] =
        useState<boolean>(!!microsoftClarity.isAccepted);
    const [googleAnalyticsChecked, setGoogleAnalyticsChecked] =
        useState<boolean>(!!googleAnalytics.isAccepted);

    const [saving, setSaving] = useState<boolean>(false);

    const saveSettings = () => {
        setSaving(true);
        if (microsoftClarityChecked) {
            microsoftClarity.accept();
        } else {
            microsoftClarity.reject();
        }
        if (googleAnalyticsChecked) {
            googleAnalytics.accept();
        } else {
            googleAnalytics.reject();
        }
        setDisplayNotification(true);
        window.location.reload();
    };

    const selectAll = () => {
        setMicrosoftClarityChecked(true);
        setGoogleAnalyticsChecked(true);
    };

    const unselectAll = () => {
        setMicrosoftClarityChecked(false);
        setGoogleAnalyticsChecked(false);
    };

    useEffectOnce(() => {
        if (displayNotification) {
            toast({
                title: 'Settings saved',
                descriptionComponent: 'Your preferences have been saved.',
                status: 'success',
                isClosable: true,
            });
            setDisplayNotification(false);
        }
    });

    if (!MICROSOFT_CLARITY_ID && !GOOGLE_ANALYTICS_ID) {
        return <NotFound />;
    }

    return (
        <Box background="white" flexGrow="1" minHeight="100%">
            <VStack
                width="600px"
                marginX="auto"
                paddingY="10"
                spacing="8"
                alignItems="stretch"
            >
                <Heading as="h1" size="md">
                    Settings
                </Heading>
                <Heading as="h2" size="sm">
                    Cookies
                </Heading>
                <Text fontSize="sm">
                    Cookies are common feature used on almost all websites. A
                    cookie is a small text file that is downloaded onto your
                    device to allow a website to recognise it and store some
                    informations about your preferences.
                </Text>
                <Text fontSize="sm">
                    Substra being a young product, we use cookies to better
                    understand your needs, expectations and pain points. By
                    allowing us to use cookies you help us improve the quality
                    and the accuracy of our services!
                </Text>
                <VStack spacing="5" alignItems="stretch">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Heading as="h3" fontSize="sm" fontWeight="semibold">
                            Cookies we use
                        </Heading>
                        <HStack spacing="1.5">
                            <Button size="xs" onClick={selectAll}>
                                Select all
                            </Button>
                            <Button size="xs" onClick={unselectAll}>
                                Unselect all
                            </Button>
                        </HStack>
                    </Flex>
                    <CookieCard
                        title={microsoftClarity.title}
                        titleLink={microsoftClarity.titleLink}
                        description={microsoftClarity.description}
                        isChecked={microsoftClarityChecked}
                        setIsChecked={setMicrosoftClarityChecked}
                        isDisabled={saving}
                    />
                    <CookieCard
                        title={googleAnalytics.title}
                        titleLink={googleAnalytics.titleLink}
                        description={googleAnalytics.description}
                        isChecked={googleAnalyticsChecked}
                        setIsChecked={setGoogleAnalyticsChecked}
                        isDisabled={saving}
                    />
                </VStack>
                <Box textAlign="right">
                    <Button
                        size="md"
                        colorScheme="primary"
                        onClick={saveSettings}
                        isDisabled={saving}
                    >
                        Save my settings
                    </Button>
                </Box>
            </VStack>
        </Box>
    );
};
export default Settings;
