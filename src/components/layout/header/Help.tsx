import {
    Box,
    Button,
    HStack,
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
    Textarea,
    UnorderedList,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';

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
----
Username: ${userId}
Date: ${shortDateFormatter.format(date)}
URL: ${window.location.href}
Browser: ${navigator.userAgent}

---
PLATFORM
Frontend: ${__APP_VERSION__}
Orchestrator: ${orchestratorVersion}
Backend: ${backendVersion}
    `;

    return (
        <>
            <MenuItem onClick={onOpen}>Help and feedback</MenuItem>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontSize="md">Help and feedback</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack alignItems="stretch" spacing="4">
                            <Text fontSize="sm">
                                Do you want some help or give us some feeedback?
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

                            <Text fontSize="sm">
                                Help us understand your problem
                            </Text>
                            <Box>
                                <UnorderedList marginLeft="7">
                                    <ListItem>
                                        <Text fontSize="sm">
                                            Describe precisely your problem and
                                            explain how to reproduce it
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

                            <Text fontSize="sm">
                                Information to add to your message
                            </Text>

                            <Box
                                paddingY="2"
                                paddingX="2"
                                borderColor="gray.500"
                                borderWidth="1px"
                                borderStyle="solid"
                            >
                                <HStack
                                    justifyContent="space-between"
                                    alignItems="flex-start"
                                    height="100%"
                                >
                                    <Textarea
                                        fontSize="sm"
                                        textColor="gray.500"
                                        height="350px"
                                        border="none"
                                        resize="none"
                                        value={bodyContent}
                                        isReadOnly
                                    />
                                    <CopyButton value={bodyContent} />
                                </HStack>
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
