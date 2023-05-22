import { useState, useEffect } from 'react';

import {
    Button,
    Text,
    VStack,
    HStack,
    Link,
    Center,
    Heading,
    useDisclosure,
} from '@chakra-ui/react';
import { RiAddLine } from 'react-icons/ri';

import { listActiveTokens } from '@/api/BearerTokenApi';
import ApiToken from '@/routes/tokens/components/ApiToken';
import { BearerTokenT, NewBearerTokenT } from '@/types/BearerTokenTypes';

import { parseToken } from './BearerTokenUtils';
import GenerateTokenModal from './components/GenerateTokenModal';

const ApiTokens = () => {
    const [activeTokens, setActiveTokens] = useState<BearerTokenT[]>([]);
    const [generatedToken, setGeneratedToken] = useState<NewBearerTokenT>();

    const { isOpen, onOpen, onClose } = useDisclosure();

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
    }, []);

    return (
        <VStack
            width="920px"
            marginX="auto"
            paddingX="6"
            paddingY="8"
            spacing="2.5"
            alignItems="stretch"
        >
            <Heading fontWeight="700" size="xxs" textTransform="uppercase">
                API tokens management
            </Heading>

            <HStack width="100%" justify="space-between">
                <VStack>
                    <Text fontWeight="400" fontSize="sm">
                        {'You can use tokens with the '}
                        <Link
                            color="black"
                            href="https://docs.substra.org/en/stable/documentation/references/sdk.html#client"
                            isExternal
                            textDecoration={'underline'}
                            textUnderlineOffset={3}
                        >
                            Substra Python Client
                        </Link>
                        .
                    </Text>
                </VStack>
                <Button
                    leftIcon={<RiAddLine />}
                    fontSize="sm"
                    fontWeight="600"
                    onClick={onOpen}
                >
                    Generate new
                </Button>
            </HStack>
            <GenerateTokenModal
                isOpen={isOpen}
                onClose={onClose}
                setGeneratedToken={setGeneratedToken}
            />
            {generatedToken && (
                <ApiToken key={generatedToken.id} token={generatedToken} />
            )}
            {activeTokens.length !== 0 ? (
                activeTokens.map((token) => (
                    <ApiToken key={token.id} token={token} />
                ))
            ) : (
                <Center>
                    <HStack spacing="2">
                        <Text>You don't have any active tokens.</Text>
                    </HStack>
                </Center>
            )}
        </VStack>
    );
};
export default ApiTokens;
