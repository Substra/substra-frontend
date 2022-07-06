import { useRef } from 'react';

import {
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Button,
} from '@chakra-ui/react';

type CancelComputePlanDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    cancelComputePlan: () => void;
    canceling: boolean;
};

const CancelComputePlanDialog = ({
    isOpen,
    onClose,
    canceling,
    cancelComputePlan,
}: CancelComputePlanDialogProps) => {
    const cancelRef = useRef<HTMLButtonElement>(null);
    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            size="sm"
            closeOnEsc={!canceling}
            closeOnOverlayClick={!canceling}
        >
            <AlertDialogOverlay>
                <AlertDialogContent fontSize="sm">
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Cancel compute plan execution
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        This will stop all ongoing tasks and cancel the
                        execution of all remaining tasks.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button
                            ref={cancelRef}
                            onClick={onClose}
                            size="sm"
                            isDisabled={canceling}
                        >
                            Close
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={cancelComputePlan}
                            marginLeft={3}
                            size="sm"
                            isLoading={canceling}
                        >
                            Cancel execution
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default CancelComputePlanDialog;
