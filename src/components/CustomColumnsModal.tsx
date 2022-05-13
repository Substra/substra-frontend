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

import useAppSelector from '@/hooks/useAppSelector';

import CopyButton from '@/components/CopyButton';

interface CustomColumnsModalProps {
    columns: string[];
    setColumns: (columns: string[]) => void;
    clearColumns: () => void;
}

const CustomColumnsModal = ({
    columns,
    setColumns,
    clearColumns,
}: CustomColumnsModalProps): JSX.Element | null => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const availableColumns = useAppSelector((state) => state.nodes.metadata);

    const initialValue = columns.join(', ');
    const [value, setValue] = useState<string>(initialValue);

    const handleOnClose = () => {
        setValue(initialValue);
        onClose();
    };

    const onSave = () => {
        if (!value) {
            clearColumns();
        } else {
            // remove white spaces and make array separating items using comas
            const newColumns = value.replace(/\s+/g, '').split(',');

            setColumns(newColumns);
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
                    <ModalBody maxHeight="80vh" overflowY="auto">
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
                            padding="12px 12px 12px 48px"
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
                            {availableColumns.length === 0 && (
                                <Text>
                                    Columns come from compute plans' metadata.
                                    It appears none of the compute plans have
                                    metadata set.
                                </Text>
                            )}
                            {availableColumns.length > 0 && (
                                <UnorderedList
                                    width="100%"
                                    display="flex"
                                    flexWrap="wrap"
                                    margin="0"
                                >
                                    {availableColumns.map((column) => (
                                        <ListItem
                                            key={column}
                                            width="50%"
                                            listStylePosition="inside"
                                        >
                                            {column}
                                        </ListItem>
                                    ))}
                                </UnorderedList>
                            )}
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
