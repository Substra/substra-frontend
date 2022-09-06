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

import useAppSelector from '@/hooks/useAppSelector';
import { shortDateFormatter } from '@/libs/utils';

import CopyButton from '@/components/CopyButton';

const Help = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const backendVersion = useAppSelector((state) => state.me.info.version);
    const orchestratorVersion = useAppSelector(
        (state) => state.me.info.orchestrator_version
    );
    const userId = useAppSelector((state) => state.me.payload.user_id);

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
                                        Get the most out of Substra! Learn how
                                        to use our tools and concepts, browse by
                                        topic or search by feature in our{' '}
                                        <Link
                                            href="https://github.com/Substra/substra-frontend"
                                            isExternal
                                            fontWeight="semibold"
                                        >
                                            Github repo
                                        </Link>
                                        !
                                    </AlertDescription>
                                </Box>
                            </Alert>
                            <Text fontSize="sm" fontWeight="semibold">
                                Github
                            </Text>
                            <Text fontSize="sm" marginBottom="3">
                                For bug reports you can raise&nbsp;
                                <Link
                                    color="primary.500"
                                    href="https://github.com/Substra/substra/issues"
                                    isExternal
                                >
                                    issues on Github.
                                </Link>
                            </Text>
                            <Text fontSize="sm" fontWeight="semibold">
                                Slack
                            </Text>
                            <Text fontSize="sm" marginBottom="3">
                                A real-time chat room to ask questions, give
                                feedback and chat about anything related to
                                Substra. Our Slack workspace is hosted by the
                                Linux Foundation for AI and Data. Please join
                                the&nbsp;
                                <Link
                                    color="primary.500"
                                    href="https://lfaifoundation.slack.com/#substra-general"
                                    isExternal
                                >
                                    substra-general channel
                                </Link>
                                &nbsp;and the&nbsp;
                                <Link
                                    color="primary.500"
                                    href="https://lfaifoundation.slack.com/#substra-help"
                                    isExternal
                                >
                                    substra-help channel.
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
