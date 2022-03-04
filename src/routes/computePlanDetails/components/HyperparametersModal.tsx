import { useEffect, useMemo, useState } from 'react';

import HyperparametersTr from './HyperparametersTr';
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Table,
    Thead,
    Tbody,
    Th,
    Tr,
    Text,
    useDisclosure,
    Input,
    InputLeftElement,
    InputGroup,
    HStack,
    VStack,
    Tag,
    TagCloseButton,
    TagLabel,
} from '@chakra-ui/react';
import { RiSearchLine } from 'react-icons/ri';

import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

import { capitalize } from '@/libs/utils';

declare const HYPERPARAMETERS: string[];

interface HyperparametersModalProps {
    computePlans: ComputePlanT[];
}

export interface HyperparamsT {
    [computePlanName: string]: Record<string, string>;
}

const HyperparametersModal = ({
    computePlans,
}: HyperparametersModalProps): JSX.Element => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [inputValue, setInputValue] = useState<string>('');
    const [inputIsFocused, setInputIsFocused] = useState<boolean>(false);
    const [filters, setFilters] = useState<string[]>([]);

    useEffect(() => {
        setFilters([]);
        setInputValue('');
    }, [isOpen]);

    const hyperparametersList = useMemo<string[]>(() => {
        const hyperparamsList: string[] = [];

        for (const computePlan of computePlans) {
            for (const data in computePlan.metadata) {
                /**
                 * Fill an array containing every hyperparameter for all the compute plans
                 * To be used to define Thead columns in the hyperparameter table
                 */
                if (
                    HYPERPARAMETERS.includes(data) &&
                    !hyperparamsList.includes(data)
                ) {
                    hyperparamsList.push(data);
                }
            }
        }
        return hyperparamsList;
    }, [computePlans]);

    const addFilter = (filter: string) => {
        setFilters([...filters, filter]);
        setInputValue('');
    };

    const removeFilter = (filter: string) => {
        setFilters(filters.filter((f) => filter !== f));
    };

    const activeHyperparameters = filters.length
        ? filters
        : hyperparametersList;

    return (
        <>
            <Button onClick={onOpen} size="xs">
                Show hyperparameters
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="4xl"
                scrollBehavior="inside"
                isCentered
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>
                        <HStack spacing="4">
                            <Text
                                color="black"
                                fontSize="md"
                                fontWeight="medium"
                                lineHeight="6"
                            >
                                Hyperparameters
                            </Text>
                            <VStack
                                position="relative"
                                justify="start"
                                spacing="0"
                            >
                                <InputGroup size="sm">
                                    <InputLeftElement
                                        pointerEvents="none"
                                        children={
                                            <RiSearchLine fill="var(--chakra-colors-gray-400)" />
                                        }
                                    />
                                    <Input
                                        placeholder="Filter hyperparameters..."
                                        width="320px"
                                        variant="outline"
                                        colorScheme="gray"
                                        size="sm"
                                        height="32px"
                                        borderRadius="50px"
                                        borderColor="gray.100"
                                        backgroundColor="gray.100"
                                        value={inputValue}
                                        _focus={{
                                            border: '2px solid var(--chakra-colors-teal-500)',
                                            backgroundColor: 'white',
                                        }}
                                        onChange={(e) =>
                                            setInputValue(e.target.value)
                                        }
                                        onFocus={() => setInputIsFocused(true)}
                                        onBlur={() => setInputIsFocused(false)}
                                    />
                                </InputGroup>
                                {inputIsFocused && (
                                    <VStack
                                        position="absolute"
                                        top="32px"
                                        left="0"
                                        spacing="0"
                                        zIndex="3"
                                        alignItems="start"
                                        width="320px"
                                        maxHeight="188px"
                                        backgroundColor="white"
                                        boxShadow="md"
                                        overflowY="auto"
                                    >
                                        {hyperparametersList
                                            .filter(
                                                (hp) =>
                                                    !filters.includes(hp) &&
                                                    hp.includes(inputValue)
                                            )
                                            .map((hp) => (
                                                <Button
                                                    key={hp}
                                                    variant="ghost"
                                                    height="30px"
                                                    paddingY="12px"
                                                    width="100%"
                                                    fontWeight="normal"
                                                    fontSize="xs"
                                                    justifyContent="start"
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                    }}
                                                    onClick={() =>
                                                        addFilter(hp)
                                                    }
                                                >
                                                    {capitalize(hp)}
                                                </Button>
                                            ))}
                                    </VStack>
                                )}
                            </VStack>
                        </HStack>
                        {filters.length > 0 && (
                            <HStack marginTop="3">
                                {filters.map((filter) => (
                                    <Tag
                                        key={filter}
                                        size="sm"
                                        variant="outline"
                                        color="gray.800"
                                        borderRadius="4px"
                                        boxShadow="inset 0 0 1px var(--chakra-colors-gray-500)"
                                    >
                                        <TagLabel
                                            fontWeight="medium"
                                            lineHeight="4"
                                        >
                                            {capitalize(filter)}
                                        </TagLabel>
                                        <TagCloseButton
                                            opacity="1"
                                            onClick={() => removeFilter(filter)}
                                        />
                                    </Tag>
                                ))}
                            </HStack>
                        )}
                    </ModalHeader>
                    <ModalBody padding="0">
                        <Table whiteSpace="nowrap" width="auto" maxWidth="100%">
                            <Thead>
                                <Tr fontSize="xs" fontWeight="bold">
                                    <Th
                                        color="gray.700"
                                        border="none"
                                        position="sticky"
                                        top="0"
                                        left="0"
                                        zIndex="2"
                                        backgroundColor="white"
                                    >
                                        NAME
                                    </Th>
                                    {activeHyperparameters.map((hp) => (
                                        <Th
                                            key={hp}
                                            color="gray.700"
                                            border="none"
                                            position="sticky"
                                            top="0"
                                            zIndex="1"
                                            backgroundColor="white"
                                        >
                                            {hp}
                                        </Th>
                                    ))}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {computePlans.map((computePlan, index) => (
                                    <HyperparametersTr
                                        key={`${computePlan.tag}`}
                                        computePlan={computePlan}
                                        hyperparametersList={
                                            activeHyperparameters
                                        }
                                        position={index + 1}
                                    />
                                ))}
                            </Tbody>
                        </Table>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default HyperparametersModal;
