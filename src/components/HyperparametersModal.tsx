import { useEffect, useState, useContext, useMemo } from 'react';

import { motion, useMotionValue } from 'framer-motion';

import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
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
    ModalContentProps,
    ModalHeaderProps,
    Wrap,
    WrapItem,
} from '@chakra-ui/react';
import { RiSearchLine } from 'react-icons/ri';

import useHyperparameters from '@/hooks/useHyperparameters';
import { PerfBrowserContext } from '@/hooks/usePerfBrowser';
import { capitalize } from '@/libs/utils';
import { ComputePlanT } from '@/modules/computePlans/ComputePlansTypes';

import HyperparametersTr from '@/components/HyperparametersTr';

interface HyperparametersModalProps {
    // the computePlans props is to be used only when there's no PerfBrowserContext available
    computePlans?: ComputePlanT[];
}

export interface HyperparamsT {
    [computePlanName: string]: Record<string, string>;
}

export const MotionModalContent = motion<ModalContentProps>(ModalContent);
export const MotionModalHeader = motion<ModalHeaderProps>(ModalHeader);

const HyperparametersModal = ({
    computePlans: propsComputePlans,
}: HyperparametersModalProps): JSX.Element => {
    const { computePlans: perfBrowserComputePlans } =
        useContext(PerfBrowserContext);

    const computePlans = propsComputePlans
        ? propsComputePlans
        : perfBrowserComputePlans;

    const hyperparametersList = useHyperparameters(computePlans);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isShowingDiffs, setIsShowingDiffs] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    const [inputIsFocused, setInputIsFocused] = useState<boolean>(false);
    const [filters, setFilters] = useState<string[]>([]);

    const toggle = () => {
        if (isOpen) {
            onClose();
        } else {
            onOpen();
        }
    };

    useEffect(() => {
        setFilters([]);
        setInputValue('');
        setIsShowingDiffs(false);
    }, [isOpen]);

    const addFilter = (filter: string) => {
        setFilters([...filters, filter]);
        setInputValue('');

        if (isShowingDiffs && !hpDiffList.includes(filter)) {
            setIsShowingDiffs(false);
        }
    };

    const removeFilter = (filter: string) => {
        setFilters(filters.filter((f) => filter !== f));

        if (isShowingDiffs && !filters.length) {
            setIsShowingDiffs(false);
        }
    };

    const clearFilters = () => {
        setFilters([]);
        setIsShowingDiffs(false);
    };

    const activeHyperparameters = filters.length
        ? filters
        : hyperparametersList;

    const hpDiffList: string[] = useMemo(() => {
        const hpDiffList: string[] = [];
        if (computePlans.length > 1) {
            for (const hp of hyperparametersList) {
                const reference = computePlans[0].metadata[hp];
                let hpHasDiff = false;
                let index = 1;

                while (!hpHasDiff && index < computePlans.length) {
                    if (computePlans[index].metadata[hp] !== reference) {
                        hpHasDiff = true;
                        hpDiffList.push(hp);
                    }
                    index++;
                }
            }
        }
        return hpDiffList;
    }, [computePlans]);

    const toggleDifferencesDisplay = () => {
        setIsShowingDiffs(true);
        setFilters(hpDiffList);
    };

    const [grabbing, setGrabbing] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    return (
        <>
            <Button onClick={toggle} size="xs">
                {!isOpen ? 'Show hyperparameters' : 'Hide hyperparameters'}
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                size="4xl"
                scrollBehavior="inside"
                isCentered
                closeOnOverlayClick={false}
                blockScrollOnMount={false}
                trapFocus={false}
                motionPreset={'none'}
                onEsc={() => setInputIsFocused(false)}
            >
                <MotionModalContent
                    style={{ x, y }}
                    pointerEvents="auto"
                    containerProps={{ pointerEvents: 'none' }}
                    overflow="hidden"
                    resize="both"
                    width="var(--chakra-sizes-4xl)"
                    minHeight="156px"
                    minWidth="560px"
                    maxWidth="none"
                    _focus={{
                        boxShadow: 'var(--chakra-shadows-lg) !important',
                    }}
                >
                    <ModalCloseButton />
                    <MotionModalHeader
                        onPan={(e, info) => {
                            x.set(x.get() + info.delta.x);
                            y.set(y.get() + info.delta.y);
                        }}
                        onMouseDown={() => setGrabbing(true)}
                        onMouseUp={() => setGrabbing(false)}
                        cursor={grabbing ? 'grabbing' : 'grab'}
                        paddingBottom={filters.length ? '0' : '4'}
                    >
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
                        <HStack marginTop="3">
                            {hpDiffList.length > 0 && (
                                <Button
                                    onClick={toggleDifferencesDisplay}
                                    size="xs"
                                    variant="outline"
                                    disabled={!isShowingDiffs ? false : true}
                                >
                                    Show only differences
                                </Button>
                            )}
                            <Button
                                onClick={clearFilters}
                                size="xs"
                                variant="outline"
                                disabled={filters.length ? false : true}
                            >
                                Clear filters
                            </Button>
                        </HStack>
                        {filters.length > 0 && (
                            <Wrap marginTop="3" paddingBottom="4">
                                {filters.map((filter) => (
                                    <WrapItem key={filter}>
                                        <Tag
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
                                                onClick={() =>
                                                    removeFilter(filter)
                                                }
                                            />
                                        </Tag>
                                    </WrapItem>
                                ))}
                            </Wrap>
                        )}
                    </MotionModalHeader>
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
                                {computePlans.map((computePlan) => (
                                    <HyperparametersTr
                                        key={computePlan.key}
                                        computePlan={computePlan}
                                        hyperparametersList={
                                            activeHyperparameters
                                        }
                                    />
                                ))}
                            </Tbody>
                        </Table>
                    </ModalBody>
                </MotionModalContent>
            </Modal>
        </>
    );
};

export default HyperparametersModal;
