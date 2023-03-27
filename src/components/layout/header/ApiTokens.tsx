import { useState, useEffect } from 'react';

import {
    Button,
    Text,
    MenuItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    VStack,
    HStack,
    Link,
    Center,
} from '@chakra-ui/react';

import { useToast } from '@/hooks/useToast';
import {
    listActiveTokens,
    requestToken,
} from '@/modules/bearerTokens/BearerTokenApi';
import { BearerTokenT } from '@/modules/bearerTokens/BearerTokenTypes';

import ApiToken from '@/components/ApiToken';

const ApiTokens = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [activeTokens, setActiveTokens] = useState<BearerTokenT[]>([]);
    const toast = useToast();

    const getFirstToken = () => {
        requestToken()
            .then((response) => {
                setActiveTokens([response]);
            })
            .catch((error) => {
                console.error(error);
                toast({
                    title: "Couldn't get a new token",
                    description: 'Something went wrong',
                    status: 'error',
                    isClosable: true,
                });
            });
    };

    const getActiveTokens = () => {
        listActiveTokens()
            .then((response) => {
                setActiveTokens(response);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        getActiveTokens();
    }, [isOpen]);
    return (
        <>
            <MenuItem onClick={onOpen}>API token</MenuItem>

            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>API token</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack alignItems="stretch" spacing="5">
                            <Text>
                                {'This API token can be used in the '}
                                <Link
                                    color="primary.500"
                                    href="https://docs.substra.org/en/stable/documentation/references/sdk.html#client"
                                    isExternal
                                >
                                    Substra Python Client
                                </Link>
                                .
                            </Text>
                            {activeTokens.length ? (
                                <ApiToken token={activeTokens[0]} />
                            ) : (
                                <Center>
                                    <HStack spacing="2">
                                        <Text>
                                            You don't have an active token.
                                        </Text>
                                        <Button
                                            size="sm"
                                            onClick={getFirstToken}
                                        >
                                            Generate a token
                                        </Button>
                                    </HStack>
                                </Center>
                            )}
                        </VStack>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
export default ApiTokens;
