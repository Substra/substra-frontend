import { useState } from 'react';

import {
    Button,
    Text,
    Code,
    VStack,
    HStack,
    Center,
    Box,
    Spacer,
    Tooltip,
} from '@chakra-ui/react';

import { useToast } from '@/hooks/useToast';
import {
    BearerTokenT,
    NewBearerTokenT,
} from '@/modules/bearerTokens/BearerTokenTypes';
import { requestToken } from '@/modules/bearerTokens/BearerTokenUtils';

import CopyButton from './CopyButton';

const ApiToken = ({ token }: { token: BearerTokenT | NewBearerTokenT }) => {
    const [apiToken, setApiToken] = useState<BearerTokenT | NewBearerTokenT>(
        token
    );
    const toast = useToast();

    const getNewToken = () => {
        requestToken()
            .then((response) => {
                setApiToken(response);
                toast({
                    title: 'Token regenerated',
                    description: 'The old token is no longer valid.',
                    status: 'success',
                    isClosable: true,
                });
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

    const tokenIsExpired = apiToken.expires_at < new Date();

    return (
        <Box border="1px" borderColor="gray.200" padding="10px">
            <HStack>
                <VStack align="left">
                    <Text fontSize="sm">
                        {'Created ' + apiToken.created_at.toLocaleString()}
                    </Text>
                    <Text
                        fontSize="sm"
                        color={tokenIsExpired ? 'red.500' : undefined}
                    >
                        {'Expires ' + apiToken.expires_at.toLocaleString()}
                    </Text>
                    <HStack height="35px">
                        {'token' in apiToken ? (
                            <>
                                <Code width="300px">{apiToken.token}</Code>
                                <CopyButton value={apiToken.token} />
                            </>
                        ) : (
                            <Text fontSize="sm" as="i">
                                Generated tokens are only displayed once.
                            </Text>
                        )}
                    </HStack>
                </VStack>
                <Spacer />
                <Center width="120px">
                    <Tooltip
                        hasArrow
                        label="This will disable your existing token"
                        bg="red.500"
                        isDisabled={tokenIsExpired || 'token' in apiToken}
                    >
                        <Button
                            onClick={getNewToken}
                            disabled={'token' in apiToken}
                        >
                            Regenerate
                        </Button>
                    </Tooltip>
                </Center>
            </HStack>
        </Box>
    );
};

export default ApiToken;
