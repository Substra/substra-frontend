import { Dispatch, SetStateAction, useState } from 'react';

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    VStack,
    Input,
    Select,
    ModalFooter,
    Button,
    Text,
    Tooltip,
} from '@chakra-ui/react';

import { requestToken } from '@/api/BearerTokenApi';
import { useToast } from '@/hooks/useToast';
import { increaseDate, shortFormatDate } from '@/libs/utils';
import { NewBearerTokenT } from '@/types/BearerTokenTypes';

import { parseNewToken } from '../BearerTokenUtils';

type GenerateTokenModalProps = {
    isOpen: boolean;
    onClose: () => void;
    setGeneratedToken: Dispatch<SetStateAction<NewBearerTokenT | undefined>>;
};

const GenerateTokenModal = ({
    isOpen,
    onClose,
    setGeneratedToken,
}: GenerateTokenModalProps): JSX.Element => {
    const toast = useToast();

    const [tokenName, setTokenName] = useState('');
    const [durationSelect, setDurationSelect] = useState('');
    const [expirationDate, setExpirationDate] = useState<string | null>('');

    const incorrectExpiration =
        expirationDate === '' ||
        (expirationDate && new Date(expirationDate) < new Date());

    const closeHandler = () => {
        setExpirationDate('');
        setTokenName('');
        setDurationSelect('');
        onClose();
    };

    const expirationHandler = (value: string) => {
        setDurationSelect(value);

        switch (value) {
            case '30days':
                setExpirationDate(increaseDate(new Date(), 30).toISOString());
                break;
            case '60days':
                setExpirationDate(increaseDate(new Date(), 60).toISOString());
                break;
            case 'never':
                setExpirationDate(null);
                break;
            case 'custom':
            default:
                break;
        }
    };

    async function generateToken() {
        try {
            const response = await requestToken(tokenName, expirationDate);
            setGeneratedToken(parseNewToken(response.data));
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

    const getLabel = () => {
        let label = '';
        if (!tokenName && !expirationDate) {
            label = 'Please choose a name and an expiration date';
        } else if (!tokenName && expirationDate) {
            label = 'Please choose a name for your token';
        } else if (tokenName && !expirationDate && expirationDate !== null) {
            label = 'Please choose an expiration date';
        } else if (tokenName && expirationDate && incorrectExpiration) {
            label = 'This token is already expired!';
        } else {
            label = '';
        }

        return label;
    };

    return (
        <Modal isOpen={isOpen} onClose={closeHandler} size="lg" isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader fontWeight="600">New API Token</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Text fontWeight="500"> Token name</Text>
                    <VStack paddingY="2" spacing="2">
                        <Input
                            type="text"
                            value={tokenName}
                            borderRadius="md"
                            maxLength={50}
                            onChange={(e) => setTokenName(e.target.value)}
                        />
                    </VStack>
                    <Text fontWeight="500"> Expiration</Text>
                    <VStack paddingY="2" spacing="2">
                        <Select
                            defaultValue={''}
                            onChange={(e) => expirationHandler(e.target.value)}
                        >
                            <option value="" disabled hidden>
                                {' '}
                                Select Option
                            </option>
                            <option value="30days">30 days</option>
                            <option value="60days">60 days</option>
                            <option value="never">Never</option>
                            <option value="custom">Custom</option>
                        </Select>
                        {durationSelect === 'custom' && (
                            <Input
                                value={expirationDate ?? ''}
                                onChange={(e) =>
                                    setExpirationDate(e.target.value)
                                }
                                type="date"
                                min={new Date().toISOString().split('T')[0]}
                            />
                        )}
                        {expirationDate && (
                            <Text
                                fontSize="sm"
                                fontWeight="400"
                                color="gray.600"
                            >
                                {`This token will expire on ${
                                    shortFormatDate(
                                        expirationDate.split('T')[0]
                                    ).split(',')[0]
                                }`}
                            </Text>
                        )}
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Tooltip label={getLabel()}>
                        <Button
                            variant="solid"
                            size="md"
                            onClick={generateToken}
                            disabled={incorrectExpiration || !tokenName}
                            colorScheme="primary"
                        >
                            Generate Token
                        </Button>
                    </Tooltip>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default GenerateTokenModal;
