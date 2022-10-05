import { useEffect, useState } from 'react';

import {
    Box,
    Text,
    Button,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionIcon,
    AccordionPanel,
    Flex,
    Heading,
    Switch,
    Link,
    Icon,
    VStack,
    HStack,
} from '@chakra-ui/react';
import { RiExternalLinkLine } from 'react-icons/ri';

import {
    useMicrosoftClarityCookie,
    useGoogleAnalyticsCookie,
} from '@/hooks/useSettingsCookies';

const installClarity = () => {
    if (MICROSOFT_CLARITY_ID) {
        // install clarity
        const clarityScript = document.createElement('script');
        document.head.appendChild(clarityScript);
        clarityScript.innerText = `
                (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${MICROSOFT_CLARITY_ID}");
            `;
    }
};

const installGoogleAnalytics = () => {
    if (GOOGLE_ANALYTICS_ID) {
        const gtagScript = document.createElement('script');
        gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
        gtagScript.async = true;
        document.head.appendChild(gtagScript);

        const script = document.createElement('script');
        document.head.appendChild(script);
        script.innerText = `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', '${GOOGLE_ANALYTICS_ID}');
        `;
    }
};

type CookieCardProps = {
    title: string;
    titleLink: string;
    description: string;
    isChecked: boolean;
    setIsChecked: (checked: boolean) => void;
};
const CookieCard = ({
    title,
    titleLink,
    description,
    isChecked,
    setIsChecked,
}: CookieCardProps): JSX.Element => (
    <Box backgroundColor="gray.50" padding="4">
        <Flex justifyContent="space-between">
            <Heading as="h3" size="xs" marginBottom="5">
                <Link href={titleLink} isExternal>
                    {title}
                    <Icon
                        as={RiExternalLinkLine}
                        marginLeft="2.5"
                        fill="primary.600"
                    />
                </Link>
            </Heading>
            <Switch
                colorScheme="primary"
                isChecked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
            />
        </Flex>
        <Text fontSize="sm">{description}</Text>
    </Box>
);

const CookieBanner = (): JSX.Element | null => {
    const microsoftClarity = useMicrosoftClarityCookie();
    const googleAnalytics = useGoogleAnalyticsCookie();

    useEffect(() => {
        if (microsoftClarity.isAccepted) {
            installClarity();
        }
    }, [microsoftClarity.isAccepted]);

    useEffect(() => {
        if (googleAnalytics.isAccepted) {
            installGoogleAnalytics();
        }
    }, [googleAnalytics.isAccepted]);

    const [isOpen, setIsOpen] = useState<boolean>(
        microsoftClarity.isAccepted === undefined ||
            googleAnalytics.isAccepted === undefined
    );
    const [microsoftClarityChecked, setMicrosoftClarityChecked] =
        useState<boolean>(true);
    const [googleAnalyticsChecked, setGoogleAnalyticsChecked] =
        useState<boolean>(true);

    const acceptAll = () => {
        microsoftClarity.accept();
        googleAnalytics.accept();
        setIsOpen(false);
    };
    const rejectAll = () => {
        microsoftClarity.reject();
        googleAnalytics.reject();
        setIsOpen(false);
    };
    const acceptSelection = () => {
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

        setIsOpen(false);
    };

    if (!MICROSOFT_CLARITY_ID && !GOOGLE_ANALYTICS_ID) {
        return null;
    }

    if (!isOpen) {
        return null;
    }

    return (
        <Box
            width="580px"
            paddingX="6"
            paddingY="4"
            position="absolute"
            bottom="8"
            right="8"
            backgroundColor="white"
            boxShadow="lg"
        >
            <VStack spacing="6" alignItems="stretch">
                <Heading as="h1" size="md">
                    Cookies are important for us
                </Heading>
                <VStack spacing="2.5" alignItems="stretch">
                    <Text fontSize="sm">
                        Substra being a young product, we use cookies to better
                        understand your needs, expectations and pain points. By
                        allowing us to use cookies you help us improve the
                        quality and the accuracy of our services!
                    </Text>
                    <Accordion allowMultiple allowToggle>
                        <AccordionItem border="none">
                            <AccordionButton
                                paddingX="0"
                                _hover={{
                                    backgroundColor: 'none',
                                    textDecoration: 'underline',
                                }}
                            >
                                <Heading
                                    as="h2"
                                    color="primary.600"
                                    fontSize="sm"
                                    fontWeight="semibold"
                                >
                                    <AccordionIcon />
                                    See and configure cookie we use
                                </Heading>
                            </AccordionButton>
                            <AccordionPanel paddingX="0">
                                <VStack spacing="1" alignItems="stretch">
                                    {MICROSOFT_CLARITY_ID && (
                                        <CookieCard
                                            title={microsoftClarity.title}
                                            titleLink={
                                                microsoftClarity.titleLink
                                            }
                                            isChecked={microsoftClarityChecked}
                                            setIsChecked={
                                                setMicrosoftClarityChecked
                                            }
                                            description={
                                                microsoftClarity.description
                                            }
                                        />
                                    )}
                                    {GOOGLE_ANALYTICS_ID && (
                                        <CookieCard
                                            title={googleAnalytics.title}
                                            titleLink={
                                                googleAnalytics.titleLink
                                            }
                                            isChecked={googleAnalyticsChecked}
                                            setIsChecked={
                                                setGoogleAnalyticsChecked
                                            }
                                            description={
                                                googleAnalytics.description
                                            }
                                        />
                                    )}
                                </VStack>
                            </AccordionPanel>
                        </AccordionItem>
                    </Accordion>
                </VStack>
                <HStack spacing="1" justifyContent="flex-end">
                    <Button variant="ghost" size="sm" onClick={rejectAll}>
                        Reject all
                    </Button>
                    <Button
                        variant="solid"
                        size="sm"
                        colorScheme="gray"
                        onClick={acceptAll}
                    >
                        Accept all
                    </Button>
                    <Button
                        variant="solid"
                        size="sm"
                        colorScheme="primary"
                        onClick={acceptSelection}
                    >
                        Accept selection
                    </Button>
                </HStack>
            </VStack>
        </Box>
    );
};

export default CookieBanner;
