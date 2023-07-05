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
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import ApiToken from '@/routes/tokens/components/ApiToken';
import { BearerTokenT, NewBearerTokenT } from '@/types/BearerTokenTypes';

import { parseToken } from './BearerTokenUtils';
import GenerateTokenModal from './components/GenerateTokenModal';

const ApiTokens = (): JSX.Element => {
    const [activeTokens, setActiveTokens] = useState<BearerTokenT[]>([]);
    const [generatedToken, setGeneratedToken] = useState<NewBearerTokenT>();
    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle('Tokens management'),
        []
    );
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
            spacing="5"
            alignItems="stretch"
        >
            <Heading fontWeight="700" size="xxs" textTransform="uppercase">
                API tokens management
            </Heading>

            <HStack width="100%" justify="space-between">
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
                <Button
                    leftIcon={<RiAddLine />}
                    size="sm"
                    onClick={onOpen}
                    colorScheme="primary"
                >
                    Generate new
                </Button>
            </HStack>
            <GenerateTokenModal
                isOpen={isOpen}
                onClose={onClose}
                setGeneratedToken={setGeneratedToken}
            />
            <VStack width="100%" spacing="2.5" alignItems="stretch">
                {generatedToken && <ApiToken token={generatedToken} />}
                {activeTokens.length !== 0 ? (
                    activeTokens.map((token) => (
                        <ApiToken key={token.id} token={token} />
                    ))
                ) : (
                    <Center>
                        <Text>You don't have any active tokens.</Text>
                    </Center>
                )}
            </VStack>
        </VStack>
    );
};
export default ApiTokens;
