import { useRef, useState, useEffect } from 'react';

import {
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    AlertDialogFooter,
    Button,
} from '@chakra-ui/react';

type UpdateNameDialogProps = {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    updateName: (name: string) => void;
    updating: boolean;
    name: string;
};

const UpdateNameDialog = ({
    title,
    isOpen,
    onClose,
    updateName,
    updating,
    name,
}: UpdateNameDialogProps) => {
    const cancelRef = useRef<HTMLButtonElement>(null);
    const [newName, setNewName] = useState(name);
    useEffect(() => setNewName(name), [name]);
    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={onClose}
            size="sm"
            closeOnEsc={!updating}
            closeOnOverlayClick={!updating}
        >
            <AlertDialogOverlay>
                <AlertDialogContent fontSize="sm">
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        {title}
                    </AlertDialogHeader>

                    <AlertDialogBody>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                updateName(newName);
                            }}
                        >
                            <FormControl isDisabled={updating}>
                                <FormLabel htmlFor="name" fontSize="sm">
                                    New name
                                </FormLabel>
                                <Input
                                    id="name"
                                    size="sm"
                                    type="text"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    isRequired
                                />
                                <FormHelperText fontSize="sm">
                                    Cannot be empty
                                </FormHelperText>
                            </FormControl>
                        </form>
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button
                            ref={cancelRef}
                            onClick={onClose}
                            size="sm"
                            isDisabled={updating}
                        >
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={() => updateName(newName)}
                            marginLeft={3}
                            size="sm"
                            isLoading={updating}
                        >
                            Update name
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    );
};

export default UpdateNameDialog;
