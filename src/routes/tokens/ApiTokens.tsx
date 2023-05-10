import { useState, useEffect } from 'react';

import {
    Button,
    Text,
    VStack,
    HStack,
    Link,
    Center,
    Input,
    Box,
    Heading,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Select,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Tooltip,
} from '@chakra-ui/react';
import { RiAddLine, RiInformationLine } from 'react-icons/ri';

import { listActiveTokens, requestToken } from '@/api/BearerTokenApi';
import CopyIconButton from '@/features/copy/CopyIconButton';
import { useToast } from '@/hooks/useToast';
import { shortFormatDate, increaseDate } from '@/libs/utils';
import ApiToken from '@/routes/tokens/components/ApiToken';
import { BearerTokenT, NewBearerTokenT } from '@/types/BearerTokenTypes';

import { parseToken, parseNewToken } from './BearerTokenUtils';

const ApiTokens = () => {
    const [activeTokens, setActiveTokens] = useState<BearerTokenT[]>([]);
    const [generatedToken, setToken] = useState<NewBearerTokenT>();
    const toast = useToast();

    const [tokenNote, setTokenNote] = useState('');
    const [expiryCalendar, setExpiryCalendar] = useState('');
    const [durationSelect, setSelect] = useState('');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const incorrectExpiration =
        (expiryCalendar === '' || new Date(expiryCalendar) < new Date()) &&
        (durationSelect === 'custom' || durationSelect === '');
    async function generateToken() {
        try {
            let expirationDate: string | null =
                durationSelect === 'custom' ? expiryCalendar : durationSelect;
            if (expirationDate === 'never') expirationDate = null;
            const response = await requestToken(tokenNote, expirationDate);
            setToken(parseNewToken(response.data));
            toast({
                title: 'New Token created',
                status: 'success',
                isClosable: true,
            });
            closeHandler();
        } catch (error) {
            console.error(error);
            toast({
                title: "Couldn't get a new token",
                status: 'error',
                isClosable: true,
            });
        }
    }

    const getActiveTokens = async () => {
        try {
            const response = await listActiveTokens();
            setActiveTokens(response.data.tokens.map(parseToken));
        } catch (error) {
            console.error(error);
        }
    };

    const closeHandler = () => {
        setExpiryCalendar('');
        setTokenNote('');
        setSelect('');
        onClose();
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
            <Modal isOpen={isOpen} onClose={closeHandler} size="lg">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader fontWeight="600">New API Token</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text fontWeight="500"> Token name</Text>
                        <VStack paddingY="2" spacing="2">
                            <Input
                                type="text"
                                value={tokenNote}
                                borderRadius="md"
                                maxLength={50}
                                onChange={(e) => setTokenNote(e.target.value)}
                            />
                        </VStack>
                        <Text fontWeight="500"> Expiration</Text>
                        <VStack paddingY="2" spacing="2">
                            <Select
                                defaultValue={''}
                                onChange={(e) => setSelect(e.target.value)}
                            >
                                <option value="" disabled hidden>
                                    {' '}
                                    Select Option
                                </option>
                                <option
                                    value={increaseDate(
                                        new Date(),
                                        30
                                    ).toISOString()}
                                >
                                    30 days
                                </option>
                                <option
                                    value={increaseDate(
                                        new Date(),
                                        60
                                    ).toISOString()}
                                >
                                    60 days
                                </option>
                                <option value={'never'}>Never</option>
                                <option value="custom">Custom</option>
                            </Select>
                            {durationSelect === 'custom' && (
                                <Input
                                    value={expiryCalendar}
                                    onChange={(e) =>
                                        setExpiryCalendar(e.target.value)
                                    }
                                    type="date"
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            )}
                            <Text>
                                {durationSelect === 'never'
                                    ? ''
                                    : durationSelect &&
                                      durationSelect !== 'never' &&
                                      durationSelect !== 'custom'
                                    ? `This token will expire on ${
                                          shortFormatDate(
                                              durationSelect.split('T')[0]
                                          ).split(',')[0]
                                      }`
                                    : durationSelect === 'custom' &&
                                      expiryCalendar
                                    ? `This token will expire on ${
                                          shortFormatDate(
                                              expiryCalendar.split('T')[0]
                                          ).split(',')[0]
                                      }`
                                    : ''}
                            </Text>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Tooltip
                            label={
                                durationSelect === '' &&
                                expiryCalendar === '' &&
                                tokenNote === ''
                                    ? 'Please choose a name and an expiration date'
                                    : tokenNote === ''
                                    ? 'Please choose a name for your token'
                                    : durationSelect === '' ||
                                      expiryCalendar === ''
                                    ? 'Please choose an expiration date'
                                    : incorrectExpiration
                                    ? 'This token is already expired!'
                                    : ''
                            }
                        >
                            <Button
                                variant="solid"
                                size="md"
                                onClick={generateToken}
                                disabled={incorrectExpiration || !tokenNote}
                            >
                                Generate Token
                            </Button>
                        </Tooltip>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            {generatedToken && (
                <Box>
                    <Alert
                        status="info"
                        overflow="visible"
                        background="green.100"
                        padding={3}
                    >
                        <AlertIcon as={RiInformationLine} h={8} color="black" />

                        <Box
                            alignItems="stretch"
                            width="100%"
                            padding={1}
                            background="green.100"
                        >
                            <AlertTitle fontSize="lg" color="black">
                                Your token has been generated!
                            </AlertTitle>
                            <AlertDescription
                                maxWidth="sm"
                                fontSize="sm"
                                color="black"
                            >
                                Make sure to copy your personal access token
                                now. You won’t be able to see it again!
                            </AlertDescription>
                            <HStack
                                alignItems="space-between"
                                spacing="0"
                                width="45%"
                            >
                                <Text
                                    background="white"
                                    padding="2"
                                    fontSize="sm"
                                    color="black"
                                >
                                    {' '}
                                    {generatedToken.token}
                                </Text>
                                <CopyIconButton
                                    value={generatedToken.token}
                                    aria-label="copy token"
                                />
                            </HStack>
                        </Box>
                    </Alert>
                    <ApiToken key={generatedToken.id} token={generatedToken} />
                </Box>
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
