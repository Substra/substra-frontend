import { useRef, useState } from 'react';

import {
    Box,
    Button,
    ButtonGroup,
    IconButton,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Text,
    Textarea,
    useDisclosure,
    useOutsideClick,
} from '@chakra-ui/react';
import { RiDownloadLine } from 'react-icons/ri';

import { useToast } from '@/hooks/useToast';

import { ColumnT } from './CustomColumnsTypes';
import { isColumn, includesColumn } from './CustomColumnsUtils';

type CustomColumnImportPopoverProps = {
    allColumns: ColumnT[];
    setSelectedColumns: (columns: ColumnT[]) => void;
};

const CustomColumnImportPopover = ({
    allColumns,
    setSelectedColumns,
}: CustomColumnImportPopoverProps): JSX.Element => {
    const [inputValue, setInputValue] = useState<string>('');
    const initialFocusRef = useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const containerRef = useRef<HTMLDivElement>(null);
    useOutsideClick({
        enabled: isOpen,
        ref: containerRef,
        handler: (event) => {
            if (!containerRef.current?.contains(event.target as HTMLElement)) {
                onClose();
            }
        },
    });

    const onImportError = () => {
        onClose();
        setSelectedColumns([]);
        toast({
            title: 'An error occurred when importing the customization',
            status: 'error',
            isClosable: true,
        });
        setInputValue('');
    };

    const onImportSuccess = (uniqueNewColumns: ColumnT[]) => {
        onClose();
        setSelectedColumns(uniqueNewColumns);
        toast({
            title: 'Customization imported!',
            status: 'success',
            isClosable: true,
        });
        setInputValue('');
    };

    const onImport = () => {
        let data;

        // Load values and make sure it's an array
        try {
            data = JSON.parse(inputValue);
        } catch {
            onImportError();
            return;
        }

        if (!Array.isArray(data)) {
            onImportError();
            return;
        }

        // Filter out non valid columns
        const newColumns: ColumnT[] = data.filter(
            (column) => isColumn(column) && includesColumn(allColumns, column)
        );

        // Remove duplicate columns
        const uniqueNewColumns: ColumnT[] = newColumns.reduce(
            (uniqueColumns: ColumnT[], column: ColumnT) => {
                if (includesColumn(uniqueColumns, column)) {
                    return uniqueColumns;
                } else {
                    return [...uniqueColumns, column];
                }
            },
            []
        );

        // Save values
        if (uniqueNewColumns.length > 0) {
            onImportSuccess(uniqueNewColumns);
        } else {
            onImportError();
        }
    };

    return (
        <Box>
            <Popover isOpen={isOpen} initialFocusRef={initialFocusRef}>
                <PopoverTrigger>
                    <IconButton
                        size="sm"
                        variant="ghost"
                        icon={<RiDownloadLine />}
                        onClick={onOpen}
                        aria-label="Import customization"
                    />
                </PopoverTrigger>
                <PopoverContent ref={containerRef}>
                    <PopoverArrow />
                    <PopoverBody padding={4}>
                        <Text fontWeight="bold" fontSize="sm" marginBottom="3">
                            Import customization
                        </Text>
                        <Textarea
                            ref={initialFocusRef}
                            placeholder="Past here your customization..."
                            fontSize="xs"
                            onChange={(e) => setInputValue(e.target.value)}
                            value={inputValue}
                            paddingRight="12"
                        />
                        <ButtonGroup
                            display="flex"
                            justifyContent="flex-end"
                            marginTop="4"
                        >
                            <Button onClick={onClose} size="sm">
                                Cancel
                            </Button>
                            <Button
                                isDisabled={!inputValue.length}
                                colorScheme="teal"
                                size="sm"
                                onClick={onImport}
                            >
                                Import
                            </Button>
                        </ButtonGroup>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Box>
    );
};

export default CustomColumnImportPopover;
