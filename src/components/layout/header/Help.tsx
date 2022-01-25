import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Link,
    ListItem,
    MenuItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    UnorderedList,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import { RiCheckboxCircleLine } from 'react-icons/ri';

import { shortDateFormatter } from '@/libs/utils';

import { useAppSelector } from '@/hooks';

import CopyButton from '@/components/CopyButton';

declare const __APP_VERSION__: string;

const Help = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const backendVersion = useAppSelector((state) => state.nodes.info.version);
    const orchestratorVersion = useAppSelector(
        (state) => state.nodes.info.orchestrator_version
    );
    const userId = useAppSelector((state) => state.user.payload.user_id);

    const date = new Date();

    const bodyContent = `USER INFORMATION

Username: ${userId}
Date: ${shortDateFormatter.format(date)}
URL: ${window.location.href}
Browser: ${navigator.userAgent}

---
PLATFORM

Frontend: version ${__APP_VERSION__}
Orchestrator: version ${orchestratorVersion}
Backend: version ${backendVersion}`;

    return (
        <>
            <MenuItem onClick={onOpen}>Help and feedback</MenuItem>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize="md" fontWeight="bold">
                        Help and feedback
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack alignItems="stretch" spacing="4">
                            <Alert
                                status="info"
                                variant="subtle"
                                overflow="visible"
                                padding="var(--chakra-space-3) var(--chakra-space-4)"
                            >
                                <AlertIcon
                                    as={RiCheckboxCircleLine}
                                    fill="blue.900"
                                />
                                <Box>
                                    <AlertTitle>Know more, do more</AlertTitle>
                                    <AlertDescription lineHeight="4">
                                        Get the most out of Owkin Connect! Learn
                                        how to use our tools and concepts,
                                        browse by topic or search by feature in
                                        our{' '}
                                        <Link
                                            href="https://connect-docs.owkin.com"
                                            isExternal
                                            fontWeight="semibold"
                                        >
                                            documentation
                                        </Link>
                                        !
                                    </AlertDescription>
                                </Box>
                            </Alert>
                            <Text fontSize="sm" marginBottom="3">
                                Do you want some help or give us some feedback?
                                We will do our best to help you! Please send us
                                an email with all the details at&nbsp;
                                <Link
                                    color="teal.500"
                                    href={`mailto:support@owkin.com?body=${encodeURI(
                                        bodyContent
                                    )}`}
                                >
                                    support@owkin.com
                                </Link>
                            </Text>

                            <Text fontSize="sm" fontWeight="semibold">
                                Help us understand your problem
                            </Text>
                            <Box>
                                <UnorderedList marginLeft="7" marginBottom="3">
                                    <ListItem>
                                        <Text fontSize="sm">
                                            Describe precisely your problem and
                                            explain how to reproduce it
                                        </Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text fontSize="sm">
                                            Specify your Python version
                                        </Text>
                                    </ListItem>
                                    <ListItem>
                                        <Text fontSize="sm">
                                            If possible, add your error log
                                            and/or some screenshots
                                        </Text>
                                    </ListItem>
                                </UnorderedList>
                            </Box>

                            <Text fontSize="sm" fontWeight="semibold">
                                Information to add to your message
                            </Text>

                            <Box position="relative">
                                <Text
                                    fontSize="sm"
                                    textColor="gray.500"
                                    as="pre"
                                    paddingY="2"
                                    paddingX="2"
                                    borderColor="gray.500"
                                    borderWidth="1px"
                                    borderStyle="solid"
                                    whiteSpace="break-spaces"
                                >
                                    {bodyContent}
                                </Text>
                                <Box position="absolute" top="1" right="1">
                                    <CopyButton value={bodyContent} />
                                </Box>
                            </Box>
                        </VStack>
                    </ModalBody>

                    <ModalFooter>
                        <Button size="sm" onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
export default Help;
