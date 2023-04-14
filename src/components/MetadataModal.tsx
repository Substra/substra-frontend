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

import { PerfBrowserContext } from '@/features/perfBrowser/usePerfBrowser';
import { capitalize } from '@/libs/utils';
import { ComputePlanT } from '@/types/ComputePlansTypes';

import MetadataModalTr from '@/components/MetadataModalTr';

type MetadataModalProps = {
    // the computePlans props is to be used only when there's no PerfBrowserContext available
    computePlans?: ComputePlanT[];
};

const MotionModalContent = motion<ModalContentProps>(ModalContent);
const MotionModalHeader = motion<ModalHeaderProps>(ModalHeader);

const MetadataModal = ({
    computePlans: propsComputePlans,
}: MetadataModalProps): JSX.Element => {
    const { computePlans: perfBrowserComputePlans } =
        useContext(PerfBrowserContext);

    const computePlans = useMemo(
        () => (propsComputePlans ? propsComputePlans : perfBrowserComputePlans),
        [propsComputePlans, perfBrowserComputePlans]
    );

    const availableColumns = useMemo(() => {
        let metadata: string[] = [];
        for (const computePlan of computePlans) {
            metadata = [...metadata, ...Object.keys(computePlan.metadata)];
        }
        return [...new Set(metadata)];
    }, [computePlans]);

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

        if (isShowingDiffs && !columnsWithDiff.includes(filter)) {
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

    const activeColumns = filters.length ? filters : availableColumns;

    const columnsWithDiff: string[] = useMemo(() => {
        const columnsWithDiff: string[] = [];
        if (computePlans.length > 1) {
            for (const column of availableColumns) {
                const reference = computePlans[0].metadata[column];
                let columnHasDiff = false;
                let index = 1;

                while (!columnHasDiff && index < computePlans.length) {
                    if (computePlans[index].metadata[column] !== reference) {
                        columnHasDiff = true;
                        columnsWithDiff.push(column);
                    }
                    index++;
                }
            }
        }
        return columnsWithDiff;
    }, [computePlans, availableColumns]);

    const toggleDifferencesDisplay = () => {
        setIsShowingDiffs(true);
        setFilters(columnsWithDiff);
    };

    const [grabbing, setGrabbing] = useState(false);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    return (
        <>
            <Button onClick={toggle} size="xs" variant="outline">
                {!isOpen ? 'Show metadata' : 'Hide metadata'}
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
                                Metadata
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
                                        placeholder="Filter metadata..."
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
                                            border: '2px solid var(--chakra-colors-primary-500)',
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
                                        {availableColumns
                                            .filter(
                                                (column) =>
                                                    !filters.includes(column) &&
                                                    column.includes(inputValue)
                                            )
                                            .map((column) => (
                                                <Button
                                                    key={column}
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
                                                        addFilter(column)
                                                    }
                                                >
                                                    {capitalize(column)}
                                                </Button>
                                            ))}
                                    </VStack>
                                )}
                            </VStack>
                        </HStack>
                        {(columnsWithDiff.length > 0 || filters.length > 0) && (
                            <HStack marginTop="3">
                                {columnsWithDiff.length > 0 && (
                                    <Button
                                        onClick={toggleDifferencesDisplay}
                                        size="xs"
                                        variant="outline"
                                        disabled={isShowingDiffs}
                                    >
                                        Show only differences
                                    </Button>
                                )}
                                {filters.length > 0 && (
                                    <Button
                                        onClick={clearFilters}
                                        size="xs"
                                        variant="outline"
                                    >
                                        Clear filters
                                    </Button>
                                )}
                            </HStack>
                        )}
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
                                    {activeColumns.map((column) => (
                                        <Th
                                            key={column}
                                            color="gray.700"
                                            border="none"
                                            position="sticky"
                                            top="0"
                                            zIndex="1"
                                            backgroundColor="white"
                                        >
                                            {column}
                                        </Th>
                                    ))}
                                </Tr>
                            </Thead>
                            <Tbody>
                                {computePlans.map((computePlan) => (
                                    <MetadataModalTr
                                        key={computePlan.key}
                                        computePlan={computePlan}
                                        columns={activeColumns}
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

export default MetadataModal;
