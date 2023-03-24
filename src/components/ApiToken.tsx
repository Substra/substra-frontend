import { useState } from 'react';

import {
    Button,
    Text,
    Code,
    VStack,
    HStack,
    Center,
    Box,
    useToast,
    Spacer,
} from '@chakra-ui/react';

import { requestToken } from '@/modules/bearerTokens/BearerTokenApi';
import {
    BearerTokenT,
    NewBearerTokenT,
} from '@/modules/bearerTokens/BearerTokenTypes';

import CopyButton from './CopyButton';

const ApiToken = (props: { token: BearerTokenT | NewBearerTokenT }) => {
    const [token, setToken] = useState<BearerTokenT | NewBearerTokenT>(
        props.token
    );
    const toast = useToast();

    function getNewToken() {
        requestToken()
            .then((response) => {
                setToken(response);
                toast({
                    title: 'Token regenerated',
                    description: 'The old token is no longer valid.',
                    status: 'success',
                    isClosable: true,
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    return (
        <Box border="1px" borderColor="gray.200" padding="10px">
            <HStack>
                <VStack align="left">
                    <Text fontSize="sm">
                        {'Created ' + token.created_at.toLocaleString()}
                    </Text>
                    <Text
                        fontSize="sm"
                        color={
                            token.expires_at < new Date()
                                ? 'red.500'
                                : undefined
                        }
                    >
                        {'Expires ' + token.expires_at.toLocaleString()}
                    </Text>
                    <HStack height="3em">
                        {'token' in token ? (
                            <>
                                <Code width="30ch">{token.token}</Code>
                                <CopyButton value={token.token} />
                            </>
                        ) : (
                            <Text fontSize="sm" as="i">
                                Generated tokens are only displayed once.
                            </Text>
                        )}
                    </HStack>
                </VStack>
                <Spacer />
                <Center>
                    <Button onClick={getNewToken} disabled={'token' in token}>
                        Regenerate
                    </Button>
                </Center>
            </HStack>
        </Box>
    );
};

export default ApiToken;
