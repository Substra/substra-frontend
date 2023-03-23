import { useState, useEffect } from 'react';

import {
    Button,
    Text,
    MenuItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    VStack,
    HStack,
    Code,
    Table,
    Thead,
    Tbody,
    Tr,
    Td,
    TableContainer,
    Link,
} from '@chakra-ui/react';

import {
    listActiveTokens,
    requestToken,
} from '@/modules/bearerTokens/BearerTokenApi';
import {
    BearerTokenT,
    NewBearerTokenT,
} from '@/modules/bearerTokens/BearerTokenTypes';

import CopyButton from '@/components/CopyButton';

const ApiTokens = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [activeTokens, setActiveTokens] = useState<BearerTokenT[]>([]);
    const [newTokenRequested, setNewTokenRequested] = useState(false);
    const [newToken, setNewToken] = useState<NewBearerTokenT>({
        token: '',
        created: new Date(),
        expires_at: new Date(),
    });

    function getNewToken() {
        requestToken()
            .then((response) => {
                setNewToken(response.data);
                setNewTokenRequested(true);
                getActiveTokens();
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function getActiveTokens() {
        listActiveTokens()
            .then((response) => {
                setActiveTokens(response.data.tokens);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        setNewTokenRequested(false);
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
                                    href="https://docs.substra.org/en/stable/documentation/references/sdk.html#client"
                                    isExternal
                                >
                                    Substra Python Client
                                </Link>
                                .
                            </Text>
                            <TableContainer>
                                <Table>
                                    <Thead>
                                        <Tr>
                                            <Td>Created</Td>
                                            <Td>Expires</Td>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {activeTokens.length ? (
                                            <Tr>
                                                <Td>
                                                    {activeTokens[0].created.toString()}
                                                </Td>
                                                <Td>
                                                    {activeTokens[0].expires_at.toString()}
                                                </Td>
                                            </Tr>
                                        ) : (
                                            <Tr>No active tokens</Tr>
                                        )}
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            <Text>
                                Warning: requesting a new token will invalidate
                                the old one!
                            </Text>
                            <Button
                                onClick={getNewToken}
                                disabled={newTokenRequested}
                            >
                                Request a new token
                            </Button>
                            {newTokenRequested && (
                                <>
                                    <Text>
                                        This token will only be shown once:
                                    </Text>
                                    <HStack>
                                        <Code>{newToken.token}</Code>
                                        <CopyButton value={newToken.token} />
                                    </HStack>
                                </>
                            )}
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
export default ApiTokens;
