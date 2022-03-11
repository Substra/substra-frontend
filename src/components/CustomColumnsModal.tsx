import { useState } from 'react';

import {
    Box,
    Button,
    HStack,
    Icon,
    ListItem,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    UnorderedList,
    useDisclosure,
} from '@chakra-ui/react';
import { RiInformationLine } from 'react-icons/ri';

import useHyperparameters, {
    customHyperparametersT,
} from '@/hooks/useHyperparameters';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

import CopyButton from '@/components/CopyButton';

interface CustomColumnsModalProps {
    computePlans: ComputePlanT[];
    customHyperparameters: customHyperparametersT[];
    replaceCustomHyperparameters: (
        hyperparameters: customHyperparametersT[]
    ) => void;
    clearCustomHyperparameters: () => void;
}

const CustomColumnsModal = ({
    computePlans,
    customHyperparameters,
    replaceCustomHyperparameters,
    clearCustomHyperparameters,
}: CustomColumnsModalProps): JSX.Element => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const hyperparametersList = useHyperparameters(computePlans);

    const initialValue = customHyperparameters.map((hp) => hp.key).join(', ');
    const [value, setValue] = useState<string>(initialValue);

    // returns first half of the hyperpameters list
    const getHPListLowerHalf = (): string[] => {
        if (hyperparametersList.length % 2) {
            return hyperparametersList.slice(
                0,
                hyperparametersList.length / 2 + 1
            );
        }
        return hyperparametersList.slice(0, hyperparametersList.length / 2);
    };

    // returns second half of the hyperpameters list
    const getHPListUpperHalf = (): string[] => {
        if (hyperparametersList.length % 2) {
            return hyperparametersList.slice(
                hyperparametersList.length / 2 + 1
            );
        }
        return hyperparametersList.slice(hyperparametersList.length / 2);
    };

    const handleOnClose = () => {
        setValue(initialValue);
        onClose();
    };

    const onSave = () => {
        if (!value) {
            clearCustomHyperparameters();
        } else {
            // remove white spaces and make array separating items using comas
            const newCustomHyperparameters = value
                .replace(/\s+/g, '')
                .split(',');

            replaceCustomHyperparameters(
                newCustomHyperparameters.map((hp) => {
                    return { key: hp };
                })
            );
        }

        onClose();
    };

    return (
        <>
            <Button size="sm" variant="outline" onClick={onOpen}>
                Customize Columns
            </Button>
            <Modal isOpen={isOpen} onClose={handleOnClose} size="xl" isCentered>
                <ModalOverlay />
                <ModalContent fontSize="xs">
                    <ModalCloseButton size="sm" onClick={handleOnClose} />
                    <ModalHeader
                        color="black"
                        fontSize="xl"
                        fontWeight="bold"
                        lineHeight="6"
                    >
                        Customize Columns
                    </ModalHeader>
                    <ModalBody>
                        <Text
                            color="black"
                            fontWeight="bold"
                            marginBottom="2.5"
                        >
                            Copy paste this value to share your custom layout to
                            others
                        </Text>
                        <Box position="relative" marginBottom="2.5">
                            <Textarea
                                placeholder="Enter the name of the columns you wish to display separated by coma (ex: column1, column2)"
                                fontSize="xs"
                                onChange={(e) => setValue(e.target.value)}
                                value={value}
                                paddingRight="12"
                            />
                            <Box position="absolute" top="1" right="0">
                                <CopyButton value={value} />
                            </Box>
                        </Box>
                        <Box
                            padding="12px 48px"
                            backgroundColor="blue.100"
                            position="relative"
                        >
                            <Icon
                                as={RiInformationLine}
                                position="absolute"
                                top="3"
                                left="4"
                                width="5"
                                height="5"
                            />
                            <Text fontWeight="bold">Available Columns</Text>
                            <HStack paddingX="2">
                                <UnorderedList minWidth="230px">
                                    {getHPListLowerHalf().map((hp) => (
                                        <ListItem key={hp}>{hp}</ListItem>
                                    ))}
                                </UnorderedList>
                                <UnorderedList minWidth="230px">
                                    {getHPListUpperHalf().map((hp) => (
                                        <ListItem key={hp}>{hp}</ListItem>
                                    ))}
                                </UnorderedList>
                            </HStack>
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <HStack spacing="2">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={handleOnClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                size="sm"
                                colorScheme="teal"
                                onClick={onSave}
                            >
                                Save
                            </Button>
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CustomColumnsModal;
