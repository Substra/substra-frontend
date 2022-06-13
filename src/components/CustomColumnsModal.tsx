import { useEffect, useMemo, useState } from 'react';

import { Reorder, useDragControls } from 'framer-motion';

import {
    Box,
    BoxProps,
    Button,
    Flex,
    Heading,
    HStack,
    Icon,
    IconButton,
    ModalCloseButton,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import {
    RiAddFill,
    RiArrowLeftRightLine,
    RiDeleteBin7Line,
    RiFileWarningLine,
    RiMenuLine,
} from 'react-icons/ri';

import useAppSelector from '@/hooks/useAppSelector';

import CustomColumnImportPopover from '@/components/CustomColumnImportPopover';
import CustomColumnSharePopover from '@/components/CustomColumnSharePopover';
import EmptyState from '@/components/EmptyState';

interface ColumnProps extends BoxProps {
    title: string;
    buttonLabel: string;
    buttonOnClick: () => void;
}
const LayoutColumn = ({
    title,
    buttonLabel,
    buttonOnClick,
    children,
    ...props
}: ColumnProps) => (
    <VStack
        paddingY="4"
        paddingX="6"
        flexBasis="50%"
        spacing="2.5"
        alignItems="stretch"
        {...props}
    >
        <Heading
            size="xs"
            fontWeight="medium"
            display="flex"
            justifyContent="space-between"
        >
            {title}
            <Button
                variant="link"
                onClick={buttonOnClick}
                size="xs"
                colorScheme="teal"
            >
                {buttonLabel}
            </Button>
        </Heading>
        <Box
            border="1px solid"
            borderColor="gray.100"
            backgroundColor="white"
            flexGrow="1"
            height="570px"
            overflow="auto"
        >
            {children}
        </Box>
    </VStack>
);

interface ReorderItemProps {
    column: string;
    remove: (column: string) => void;
}
const ReorderItem = ({ column, remove }: ReorderItemProps) => {
    const controls = useDragControls();

    return (
        <Reorder.Item
            value={column}
            dragListener={false}
            dragControls={controls}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                padding: 'var(--chakra-sizes-2\\.5)',
                border: '1px solid var(--chakra-colors-gray-100)',
                width: '100%',
                fontSize: 'var(--chakra-fontSizes-xs)',
                marginBottom: 'var(--chakra-sizes-2\\.5)',
            }}
        >
            <IconButton
                icon={<Icon as={RiDeleteBin7Line} />}
                size="xs"
                onClick={() => remove(column)}
                variant="ghost"
                aria-label="Remove from selection"
            />
            <Text marginX="2.5">{column}</Text>
            <Icon
                as={RiMenuLine}
                marginLeft="auto"
                cursor="grab"
                onPointerDown={(e) => controls.start(e)}
            />
        </Reorder.Item>
    );
};

interface CustomColumnsModalProps {
    columns: string[];
    setColumns: (columns: string[]) => void;
}

const CustomColumnsModal = ({
    columns,
    setColumns,
}: CustomColumnsModalProps): JSX.Element | null => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const allColumns = useAppSelector((state) => state.organizations.metadata);
    const [selectedColumns, setSelectedColumns] = useState<string[]>(columns);
    const availableColumns = useMemo(
        () => allColumns.filter((column) => !selectedColumns.includes(column)),
        [selectedColumns, allColumns]
    );

    useEffect(() => {
        setSelectedColumns(columns);
    }, [columns]);

    const handleOnClose = () => {
        setSelectedColumns(columns);
        onClose();
    };

    const onSave = () => {
        setColumns(selectedColumns);
        onClose();
    };

    const addColumn = (column: string) => {
        setSelectedColumns([...selectedColumns, column]);
    };
    const removeColumn = (column: string) => {
        setSelectedColumns(selectedColumns.filter((col) => col !== column));
    };
    const removeAll = () => {
        setSelectedColumns([]);
    };
    const addAll = () => {
        setSelectedColumns([...selectedColumns, ...availableColumns]);
    };

    return (
        <>
            <Button size="sm" variant="outline" onClick={onOpen}>
                Customize Columns
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={handleOnClose}
                size="4xl"
                isCentered
            >
                <ModalOverlay />
                <ModalContent fontSize="xs" position="relative">
                    <ModalHeader
                        color="black"
                        fontSize="xl"
                        fontWeight="bold"
                        lineHeight="6"
                    >
                        <Flex justifyContent="space-between">
                            Customize Columns
                            <HStack space="2" marginRight={6}>
                                <CustomColumnImportPopover
                                    allColumns={allColumns}
                                    setSelectedColumns={setSelectedColumns}
                                />
                                <CustomColumnSharePopover
                                    selectedColumns={selectedColumns}
                                />
                                <ModalCloseButton
                                    size="sm"
                                    onClick={handleOnClose}
                                    position="absolute"
                                    top="20px"
                                    right="18px"
                                />
                            </HStack>
                        </Flex>
                    </ModalHeader>
                    <ModalBody
                        backgroundColor="gray.50"
                        maxHeight="80vh"
                        display="flex"
                        alignItems="stretch"
                        padding="0"
                    >
                        {allColumns.length === 0 && (
                            <Flex
                                padding="12"
                                justifyContent="center"
                                flexGrow="1"
                            >
                                <EmptyState
                                    title="No columns available"
                                    subtitle="Available columns come from compute plan metadata"
                                    icon={<RiFileWarningLine />}
                                />
                            </Flex>
                        )}
                        {allColumns.length > 0 && (
                            <>
                                <LayoutColumn
                                    title="Selected"
                                    buttonLabel="Remove all"
                                    buttonOnClick={removeAll}
                                >
                                    <Reorder.Group
                                        values={selectedColumns}
                                        onReorder={setSelectedColumns}
                                        style={{
                                            listStyle: 'none',
                                            width: '100%',
                                            padding: 'var(--chakra-sizes-4)',
                                        }}
                                    >
                                        {selectedColumns.map((column) => (
                                            <ReorderItem
                                                key={column}
                                                column={column}
                                                remove={removeColumn}
                                            />
                                        ))}
                                    </Reorder.Group>
                                </LayoutColumn>
                                <VStack
                                    color="gray.800"
                                    spacing="3"
                                    flexGrow="0"
                                    flexBasis="20px"
                                    flexShrink="0"
                                >
                                    <Box
                                        width="1px"
                                        borderRight="1px solid"
                                        borderRightColor="gray.200"
                                        flexGrow="1"
                                    />
                                    <Icon
                                        as={RiArrowLeftRightLine}
                                        fontSize="18px"
                                    />
                                    <Box
                                        width="1px"
                                        borderRight="1px solid"
                                        borderRightColor="gray.200"
                                        flexGrow="1"
                                    />
                                </VStack>
                                <LayoutColumn
                                    title="Available"
                                    buttonLabel="Add all"
                                    buttonOnClick={addAll}
                                >
                                    <VStack spacing="2.5" padding="4">
                                        {availableColumns.map((column) => (
                                            <Flex
                                                key={column}
                                                width="100%"
                                                padding="2.5"
                                                border="1px solid"
                                                borderColor="gray.100"
                                                fontSize="xs"
                                                justifyContent="flex-start"
                                                alignItems="center"
                                            >
                                                <IconButton
                                                    icon={
                                                        <Icon as={RiAddFill} />
                                                    }
                                                    variant="solid"
                                                    colorScheme="teal"
                                                    aria-label={
                                                        'Add to selection'
                                                    }
                                                    size="xs"
                                                    width="5"
                                                    minWidth="5"
                                                    height="5"
                                                    borderRadius="10px"
                                                    onClick={() =>
                                                        addColumn(column)
                                                    }
                                                />
                                                <Text marginX="2.5">
                                                    {column}
                                                </Text>
                                            </Flex>
                                        ))}
                                    </VStack>
                                </LayoutColumn>
                            </>
                        )}
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
                            {allColumns.length > 0 && (
                                <Button
                                    size="sm"
                                    colorScheme="teal"
                                    onClick={onSave}
                                >
                                    Save
                                </Button>
                            )}
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CustomColumnsModal;
