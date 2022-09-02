import { useCallback, useEffect, useRef, useState } from 'react';

import {
    DrawerContent,
    IconButton,
    AlertDialog,
    AlertDialogOverlay,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogBody,
    AlertDialogFooter,
    Button,
    DrawerBody,
    VStack,
    Skeleton,
    DrawerFooter,
    HStack,
    useClipboard,
    useDisclosure,
} from '@chakra-ui/react';
import { RiDeleteBinLine } from 'react-icons/ri';

import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import { useToast } from '@/hooks/useToast';
import * as UsersApi from '@/modules/users/UsersApi';
import {
    deleteUser,
    retrieveUser,
    updateUser,
} from '@/modules/users/UsersSlice';
import { UserRolesT } from '@/modules/users/UsersTypes';
import { compilePath, PATHS } from '@/paths';

import DrawerHeader from '@/components/DrawerHeader';
import { DrawerSectionEntry } from '@/components/DrawerSection';

import RoleInput from './RoleInput';

const UpdateUserForm = ({
    closeHandler,
}: {
    closeHandler: () => void;
}): JSX.Element => {
    const dispatch = useAppDispatch();
    const toast = useToast();
    const key = useKeyFromPath(PATHS.USER);

    const {
        isOpen: isConfirmOpen,
        onOpen: onConfirmOpen,
        onClose: onConfirmClose,
    } = useDisclosure();

    const [resetUrl, setResetUrl] = useState('');
    const { onCopy } = useClipboard(resetUrl);
    const cancelRef = useRef<HTMLButtonElement>(null);

    const user = useAppSelector((state) => state.users.user);
    const userLoading = useAppSelector((state) => state.users.userLoading);
    const deleting = useAppSelector((state) => state.users.deleting);

    const [role, setRole] = useState(UserRolesT.user);

    const onEdit = () => {
        if (user && role !== user.role) {
            dispatch(updateUser({ key: user.username, payload: { role } }));

            toast({
                title: `User updated`,
                description: `${user.username} was successfully updated!`,
                status: 'success',
                isClosable: true,
            });

            closeHandler();
        }
    };

    const onDelete = () => {
        if (!key) return;
        dispatch(deleteUser(key));
        closeHandler();
    };

    const onReset = async () => {
        if (!key) return;
        const response = await UsersApi.requestResetToken(key);
        const resetToken = response.data.reset_password_token;
        setResetUrl(
            compilePath(window.location.origin + PATHS.RESET_PASSWORD, {
                key: key as string,
                token: resetToken,
            }).concat(`?token=${resetToken}`)
        );
    };

    const copyTokenAndToast = useCallback(() => {
        onCopy();
        toast({
            title: 'Reset url copied in clipboard',
            status: 'success',
            isClosable: true,
        });
    }, [onCopy, toast]);

    useEffect(() => {
        if (resetUrl !== '') {
            copyTokenAndToast();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetUrl]);

    useEffect(() => {
        if (key) {
            dispatch(retrieveUser(key));
        }
    }, [dispatch, key]);

    useEffect(() => {
        if (user?.role) {
            setRole(user.role);
        }
    }, [user]);

    return (
        <DrawerContent data-cy="drawer">
            <DrawerHeader
                title="Edit user"
                loading={userLoading}
                onClose={closeHandler}
                extraButtons={
                    <IconButton
                        aria-label="Delete asset"
                        variant="ghost"
                        fontSize="20px"
                        color="gray.500"
                        icon={<RiDeleteBinLine />}
                        onClick={onConfirmOpen}
                    />
                }
            />
            <AlertDialog
                isOpen={isConfirmOpen}
                leastDestructiveRef={cancelRef}
                onClose={onConfirmClose}
                size="sm"
                closeOnEsc={!deleting}
                closeOnOverlayClick={!deleting}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent fontSize="sm">
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete user
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure you want to delete this user?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button
                                ref={cancelRef}
                                onClick={onConfirmClose}
                                size="sm"
                                isDisabled={deleting}
                            >
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={onDelete}
                                ml="3"
                                size="sm"
                                isLoading={deleting}
                            >
                                Yes I'm sure
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <DrawerBody
                as={VStack}
                alignItems="stretch"
                spacing="8"
                paddingX="5"
                paddingY="8"
            >
                <VStack spacing={1} alignItems="flex-start">
                    <DrawerSectionEntry title="Username">
                        {userLoading || !user ? (
                            <Skeleton height="4" width="250px" />
                        ) : (
                            user.username
                        )}
                    </DrawerSectionEntry>
                    {userLoading || !user ? (
                        <DrawerSectionEntry title="Role">
                            <Skeleton height="4" width="250px" />
                        </DrawerSectionEntry>
                    ) : (
                        <RoleInput value={role} onChange={setRole} />
                    )}
                    <DrawerSectionEntry title="Password" alignItems="baseline">
                        {userLoading || !user ? (
                            <Skeleton height="4" width="250px" />
                        ) : (
                            <Button
                                size="sm"
                                colorScheme="teal"
                                onClick={onReset}
                            >
                                Generate reset link
                            </Button>
                        )}
                    </DrawerSectionEntry>
                </VStack>
            </DrawerBody>
            <DrawerFooter>
                <HStack spacing="2">
                    <Button size="sm" variant="outline" onClick={closeHandler}>
                        Cancel
                    </Button>
                    <Button size="sm" colorScheme="teal" onClick={onEdit}>
                        Edit
                    </Button>
                </HStack>
            </DrawerFooter>
        </DrawerContent>
    );
};

export default UpdateUserForm;