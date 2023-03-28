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
import { requestToken } from '@/modules/bearerTokens/BearerTokenApi';
import {
    BearerTokenT,
    NewBearerTokenT,
} from '@/modules/bearerTokens/BearerTokenTypes';
import { parseNewToken } from '@/modules/bearerTokens/BearerTokenUtils';

import CopyButton from './CopyButton';

const ApiToken = ({ token }: { token: BearerTokenT | NewBearerTokenT }) => {
    const [apiToken, setApiToken] = useState<BearerTokenT | NewBearerTokenT>(
        token
    );
    const toast = useToast();

    const getNewToken = async () => {
        try {
            const response = await requestToken();
            setApiToken(parseNewToken(response.data));
            toast({
                title: 'Token regenerated',
                descriptionComponent: 'The old token is no longer valid.',
                status: 'success',
                isClosable: true,
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Couldn't get a new token",
                status: 'error',
                isClosable: true,
            });
        }
    };

    const tokenIsExpired = apiToken.expires_at < new Date();

    return (
        <Box
            borderWidth="1px"
            borderStyle="solid"
            borderColor="gray.100"
            padding="2.5"
        >
            <HStack>
                <VStack align="left">
                    <Text fontSize="sm">
                        {`Created ${apiToken.created_at.toLocaleString()}`}
                    </Text>
                    <Text
                        fontSize="sm"
                        color={tokenIsExpired ? 'red.500' : undefined}
                    >
                        {`Expires ${apiToken.expires_at.toLocaleString()}`}
                    </Text>
                    {'token' in apiToken ? (
                        <HStack height="35px">
                            <Code width="300px">{apiToken.token}</Code>
                            <CopyButton value={apiToken.token} />
                        </HStack>
                    ) : (
                        <Text height="35px" fontSize="sm" fontStyle="italic">
                            Generated tokens are only displayed once.
                        </Text>
                    )}
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
                            isDisabled={'token' in apiToken}
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
