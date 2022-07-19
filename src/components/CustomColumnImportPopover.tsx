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

type CustomColumnImportPopoverProps = {
    allColumns: string[];
    setSelectedColumns: (columns: string[]) => void;
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

    const onImport = () => {
        // Remove white spaces and make array separating items using comas
        const valuesToArray = inputValue.replace(/\s+/g, '').split(',');
        // Make sure values are available columns
        const newColumns = valuesToArray.filter((el) =>
            allColumns.includes(el)
        );
        // Remove duplicated column import
        const uniqueNewColumns = [...new Set(newColumns)];
        onClose();
        setSelectedColumns(uniqueNewColumns);
        if (uniqueNewColumns.length > 0) {
            toast({
                title: 'Customization imported!',
                status: 'success',
                isClosable: true,
            });
        } else {
            toast({
                title: 'An error occurred when importing the customization',
                status: 'error',
                isClosable: true,
            });
        }
        setInputValue('');
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
