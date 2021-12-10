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
import Cookies from 'universal-cookie';

declare const MICROSOFT_CLARITY_ID: string;

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

const toBool = (value: string | undefined): boolean | undefined => {
    if (value === undefined) {
        return undefined;
    }

    if (value === 'true') {
        return true;
    }

    if (value === 'false') {
        return false;
    }
    throw `Cannot convert value to boolean: ${value}`;
};

const CookieBanner = (): JSX.Element | null => {
    const cookies = new Cookies();
    const isclarityAccepted = toBool(cookies.get('isClarityAccepted'));

    useEffect(() => {
        if (isclarityAccepted) {
            installClarity();
        }
    }, [isclarityAccepted]);

    const [isOpen, setIsOpen] = useState<boolean>(
        isclarityAccepted === undefined
    );
    const [clarityChecked, setClarityChecked] = useState<boolean>(true);

    const acceptAll = () => {
        cookies.set('isClarityAccepted', true);
        setIsOpen(false);
    };
    const rejectAll = () => {
        cookies.set('isClarityAccepted', false);
        setIsOpen(false);
    };
    const acceptSelection = () => {
        cookies.set('isClarityAccepted', clarityChecked);
        setIsOpen(false);
    };

    if (!MICROSOFT_CLARITY_ID) {
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
                        Owkin Connect being a young product, we use cookies to
                        better understand your needs, expectations and pain
                        points. By allowing us to use cookies you help us
                        improve the quality and the accuracy of our services!
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
                                    color="teal.600"
                                    fontSize="sm"
                                    fontWeight="semibold"
                                >
                                    <AccordionIcon />
                                    See and configure cookie we use
                                </Heading>
                            </AccordionButton>
                            <AccordionPanel paddingX="0">
                                <Box backgroundColor="gray.50" padding="4">
                                    <Flex justifyContent="space-between">
                                        <Heading
                                            as="h3"
                                            size="xs"
                                            marginBottom="5"
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
                                        <Switch
                                            colorScheme="teal"
                                            isChecked={clarityChecked}
                                            onChange={() =>
                                                setClarityChecked(
                                                    !clarityChecked
                                                )
                                            }
                                        />
                                    </Flex>
                                    <Text fontSize="sm">
                                        Clarity is a free user behavior
                                        analytics tool that helps us understand
                                        how users are interacting with Connect
                                        through session replays and heatmaps.
                                    </Text>
                                </Box>
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
                        colorScheme="teal"
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
