import { useEffect, useState } from 'react';

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

import useCookie, { toBool } from '@/hooks/useCookie';
import useCookieSettings from '@/hooks/useCookieSettings';
import { useToast } from '@/hooks/useToast';
import NotFound from '@/routes/notfound/NotFound';

const Settings = (): JSX.Element => {
    const toast = useToast();
    const [displayNotification, setDisplayNotification] = useCookie(
        'displaySavedSettingsNotification',
        toBool
    );
    const { isClarityAccepted, acceptClarity, rejectClarity } =
        useCookieSettings();

    const [clarityChecked, setClarityChecked] = useState<boolean>(
        !!isClarityAccepted
    );

    const [saving, setSaving] = useState<boolean>(false);

    const saveSettings = () => {
        setSaving(true);
        if (clarityChecked) {
            acceptClarity();
        } else {
            rejectClarity();
        }
        setDisplayNotification(true);
        window.location.reload();
    };

    const selectAll = () => {
        setClarityChecked(true);
    };

    const unselectAll = () => {
        setClarityChecked(false);
    };

    useEffect(() => {
        if (displayNotification) {
            toast({
                title: 'Settings saved',
                description: 'Your preferences have been saved.',
                status: 'success',
                isClosable: true,
            });
            setDisplayNotification(false);
        }
    }, []);

    if (!MICROSOFT_CLARITY_ID) {
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
                    Owkin Connect being a young product, we use cookies to
                    better understand your needs, expectations and pain points.
                    By allowing us to use cookies you help us improve the
                    quality and the accuracy of our services!
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
                    <HStack
                        background="gray.50"
                        padding="4"
                        spacing="5"
                        alignItems="flex-start"
                    >
                        <Heading
                            as="h4"
                            size="xs"
                            fontSize="sm"
                            whiteSpace="nowrap"
                        >
                            <Link
                                href="https://clarity.microsoft.com/"
                                isExternal
                            >
                                Microsoft clarity
                                <Icon
                                    as={RiExternalLinkLine}
                                    marginLeft="2.5"
                                    fill="teal.600"
                                />
                            </Link>
                        </Heading>
                        <Text fontSize="xs">
                            Clarity is a free user behavior analytics tool that
                            helps us understand how users are interacting with
                            Connect through session replays and heatmaps.
                        </Text>
                        <Switch
                            size="sm"
                            colorScheme="teal"
                            isChecked={clarityChecked}
                            isDisabled={saving}
                            onChange={() => setClarityChecked(!clarityChecked)}
                        />
                    </HStack>
                </VStack>
                <Box textAlign="right">
                    <Button
                        size="md"
                        colorScheme="teal"
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
