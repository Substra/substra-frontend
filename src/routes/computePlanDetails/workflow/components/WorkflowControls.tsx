import { Button, Flex, HStack, IconButton, Kbd } from '@chakra-ui/react';
import { RiAddFill, RiSubtractFill } from 'react-icons/ri';

type WorkflowControlProps = {
    resetZoom: () => void;
    zoomOut: () => void;
    zoomIn: () => void;
    zoomOutDisabled: boolean;
    zoomInDisabled: boolean;
};

const WorkflowControls = ({
    resetZoom,
    zoomOut,
    zoomIn,
    zoomInDisabled = true,
    zoomOutDisabled = true,
}: WorkflowControlProps): JSX.Element => {
    return (
        <Flex
            position="absolute"
            right="var(--chakra-space-8)"
            bottom="var(--chakra-space-8)"
            zIndex={4}
        >
            <HStack spacing="2" justifyContent="flex-end">
                <Button
                    aria-label="Reset zoom"
                    variant="solid"
                    colorScheme="gray"
                    size="sm"
                    onClick={resetZoom}
                    backgroundColor="white"
                    rightIcon={<Kbd backgroundColor="white">R</Kbd>}
                    style={{
                        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                        borderRadius: 2,
                    }}
                >
                    Reset zoom
                </Button>
                <IconButton
                    aria-label="Zoom out"
                    icon={<RiSubtractFill />}
                    isDisabled={zoomOutDisabled}
                    variant="solid"
                    colorScheme="gray"
                    size="sm"
                    onClick={zoomOut}
                    backgroundColor="white"
                    style={{
                        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                        borderRadius: 2,
                    }}
                />
                <IconButton
                    aria-label="Zoom in"
                    icon={<RiAddFill />}
                    isDisabled={zoomInDisabled}
                    variant="solid"
                    colorScheme="gray"
                    size="sm"
                    onClick={zoomIn}
                    backgroundColor="white"
                    style={{
                        boxShadow: 'rgba(0, 0, 0, 0.24) 0px 3px 8px',
                        borderRadius: 2,
                    }}
                />
            </HStack>
        </Flex>
    );
};

export default WorkflowControls;
