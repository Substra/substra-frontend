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

    const [tokenNote, setTokenNote] = useState('');
    const [expiryCalendar, setExpiryCalendar] = useState('');
    const [durationSelect, setDurationSelect] = useState('');

    const incorrectExpiration =
        (expiryCalendar === '' || new Date(expiryCalendar) < new Date()) &&
        (durationSelect === 'custom' || durationSelect === '');

    const closeHandler = () => {
        setExpiryCalendar('');
        setTokenNote('');
        setDurationSelect('');
        onClose();
    };

    async function generateToken() {
        try {
            let expirationDate: string | null =
                durationSelect === 'custom' ? expiryCalendar : durationSelect;
            if (expirationDate === 'never') expirationDate = null;
            const response = await requestToken(tokenNote, expirationDate);
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

    return (
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
                            onChange={(e) => setDurationSelect(e.target.value)}
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
                                : durationSelect && durationSelect !== 'custom'
                                ? `This token will expire on ${
                                      shortFormatDate(
                                          durationSelect.split('T')[0]
                                      ).split(',')[0]
                                  }`
                                : durationSelect === 'custom' && expiryCalendar
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
                                : durationSelect === '' || expiryCalendar === ''
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
    );
};

export default GenerateTokenModal;
