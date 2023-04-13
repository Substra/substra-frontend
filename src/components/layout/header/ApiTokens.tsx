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

import { listActiveTokens, requestToken } from '@/api/BearerTokenApi';
import ApiToken from '@/features/bearerTokens/ApiToken';
import {
    parseToken,
    parseNewToken,
} from '@/features/bearerTokens/BearerTokenUtils';
import { useToast } from '@/hooks/useToast';
import { BearerTokenT } from '@/types/BearerTokenTypes';

const ApiTokens = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [activeTokens, setActiveTokens] = useState<BearerTokenT[]>([]);
    const toast = useToast();

    const getFirstToken = async () => {
        try {
            const response = await requestToken();
            setActiveTokens([parseNewToken(response.data)]);
        } catch (error) {
            console.error(error);
            toast({
                title: "Couldn't get a new token",
                status: 'error',
                isClosable: true,
            });
        }
    };

    const getActiveTokens = async () => {
        try {
            const response = await listActiveTokens();
            setActiveTokens(response.data.tokens.map(parseToken));
        } catch (error) {
            console.error(error);
        }
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
