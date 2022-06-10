import { useRef } from 'react';

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
    useClipboard,
    useDisclosure,
    useOutsideClick,
} from '@chakra-ui/react';
import { RiShareForwardLine } from 'react-icons/ri';

import { useToast } from '@/hooks/useToast';

interface CustomColumnSharePopoverProps {
    selectedColumns: string[];
}

const CustomColumnSharePopover = ({
    selectedColumns,
}: CustomColumnSharePopoverProps): JSX.Element => {
    const initialFocusRef = useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { onCopy } = useClipboard(selectedColumns.join(', '));
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
    const onCopyMetadata = () => {
        onCopy();
        onClose();
        toast({
            title: 'Copied in clipboard',
            status: 'success',
            isClosable: true,
        });
    };

    return (
        <Box>
            <Popover isOpen={isOpen} initialFocusRef={initialFocusRef}>
                <PopoverTrigger>
                    <IconButton
                        size="sm"
                        variant="ghost"
                        icon={<RiShareForwardLine />}
                        onClick={onOpen}
                        aria-label="Share customization"
                    />
                </PopoverTrigger>
                <PopoverContent ref={containerRef}>
                    <PopoverArrow />
                    <PopoverBody padding={4}>
                        <Text fontWeight="bold" fontSize="sm" marginBottom="3">
                            Share customization
                        </Text>
                        <Textarea
                            isDisabled
                            value={selectedColumns.join(', ')}
                            fontSize="xs"
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
                                ref={initialFocusRef}
                                onClick={onCopyMetadata}
                                size="sm"
                                value={selectedColumns.join(', ')}
                                textTransform="capitalize"
                                colorScheme="teal"
                                variant="solid"
                                aria-label="Copy metadata"
                            >
                                Copy
                            </Button>
                        </ButtonGroup>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
        </Box>
    );
};

export default CustomColumnSharePopover;
