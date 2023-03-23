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
    Code,
    Table,
    Thead,
    Tbody,
    Tr,
    Td,
    TableContainer,
    Link,
} from '@chakra-ui/react';

import { retrieveToken } from '@/modules/bearerTokens/BearerTokenApi';
import { fromRawToken } from '@/modules/bearerTokens/BearerTokenTypes';

import CopyButton from '@/components/CopyButton';

const ApiTokens = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [token, setToken] = useState({
        payload: 'Loading',
        expiration: new Date(),
    });
    useEffect(() => {
        retrieveToken()
            .then((response) => {
                setToken(fromRawToken(response.data));
            })
            .catch((error) => {
                console.error(error);
                setToken({ payload: 'Error', expiration: new Date() });
            });
    }, []);
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
                                            <Td>Token</Td>
                                            <Td>Expiration</Td>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td>
                                                <Code>{token.payload}</Code>
                                                <CopyButton
                                                    value={token.payload}
                                                />
                                            </Td>
                                            <Td>
                                                {token.expiration.toString()}
                                            </Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </TableContainer>
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
