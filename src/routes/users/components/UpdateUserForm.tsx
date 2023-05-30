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
    Text,
    useClipboard,
    useDisclosure,
    Tooltip,
} from '@chakra-ui/react';
import { RiDeleteBinLine } from 'react-icons/ri';

import * as UsersApi from '@/api/UsersApi';
import { useToast } from '@/hooks/useToast';
import { compilePath, PATHS } from '@/paths';
import { UserRolesT } from '@/types/UsersTypes';

import DrawerHeader from '@/components/DrawerHeader';
import { DrawerSectionEntry } from '@/components/DrawerSection';

import useUsersStore from '../useUsersStore';
import RoleInput from './RoleInput';

const UpdateUserForm = ({
    closeHandler,
    username,
}: {
    closeHandler: () => void;
    username: string;
}): JSX.Element => {
    const toast = useToast();

    const {
        isOpen: isConfirmOpen,
        onOpen: onConfirmOpen,
        onClose: onConfirmClose,
    } = useDisclosure();

    const [resetUrl, setResetUrl] = useState('');
    const { onCopy } = useClipboard(resetUrl);
    const cancelRef = useRef<HTMLButtonElement>(null);

    const { user, deletingUser, fetchUser, updateUser, deleteUser } =
        useUsersStore();

    const [role, setRole] = useState(UserRolesT.user);
    const [isLastAdmin, setIsLastAdmin] = useState<boolean>(false);

    // Custom loading state that handles both loading the user and checking
    // whether they are the last admin.
    const [loading, setLoading] = useState(true);

    const onUpdate = async () => {
        if (user && role !== user.role) {
            const error = await updateUser(user.username, { role });

            if (error === null) {
                toast({
                    title: `User updated`,
                    descriptionComponent: () => (
                        <Text>{user.username} was successfully updated!</Text>
                    ),
                    status: 'success',
                    isClosable: true,
                });

                closeHandler();
            } else {
                toast({
                    title: 'User update failed',
                    descriptionComponent:
                        typeof error === 'string'
                            ? error
                            : "Couldn't update user",
                    status: 'error',
                    isClosable: true,
                });
            }
        }
    };

    const onDelete = async () => {
        const error = await deleteUser(username);

        if (error === null) {
            toast({
                title: `User deleted`,
                descriptionComponent: () => (
                    <Text>{username} was successfully deleted</Text>
                ),
                status: 'success',
                isClosable: true,
            });

            closeHandler();
        } else {
            toast({
                title: 'User deletion failed',
                descriptionComponent:
                    typeof error === 'string' ? error : "Couldn't delete user",
                status: 'error',
                isClosable: true,
            });
        }
    };

    const onReset = async () => {
        const response = await UsersApi.requestResetToken(username);
        const resetToken = response.data.reset_password_token;
        setResetUrl(
            compilePath(window.location.origin + PATHS.RESET_PASSWORD, {
                key: username,
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
        setLoading(true);
        const fetchAll = async () => {
            const user = await fetchUser(username);

            if (user) {
                // check if current user is the last admin
                if (user.role === UserRolesT.admin) {
                    const response = await UsersApi.listUsers(
                        { pageSize: 1, role: UserRolesT.admin },
                        {}
                    );
                    const adminsCount = response.data.count;

                    if (adminsCount === 1) {
                        setIsLastAdmin(true);
                    } else {
                        setIsLastAdmin(false);
                    }
                } else {
                    setIsLastAdmin(false);
                }
                // finish setting up
                setRole(user.role);
                setLoading(false);
            }
        };
        fetchAll();
    }, [fetchUser, username]);

    const isDisabled = isLastAdmin && user?.role === UserRolesT.admin;

    return (
        <DrawerContent data-cy="drawer">
            <DrawerHeader
                title="Edit user"
                loading={loading}
                onClose={closeHandler}
                extraButtons={
                    <Tooltip
                        label="You cannot delete the last admin"
                        fontSize="xs"
                        isDisabled={!isDisabled}
                        hasArrow
                        placement="bottom"
                        shouldWrapChildren
                    >
                        <IconButton
                            aria-label="Delete asset"
                            variant="ghost"
                            fontSize="20px"
                            color="gray.500"
                            icon={<RiDeleteBinLine />}
                            onClick={onConfirmOpen}
                            disabled={isDisabled}
                        />
                    </Tooltip>
                }
            />
            <AlertDialog
                isOpen={isConfirmOpen}
                leastDestructiveRef={cancelRef}
                onClose={onConfirmClose}
                size="sm"
                closeOnEsc={!deletingUser}
                closeOnOverlayClick={!deletingUser}
                isCentered
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
                                isDisabled={deletingUser}
                            >
                                Cancel
                            </Button>
                            <Button
                                colorScheme="red"
                                onClick={onDelete}
                                ml="3"
                                size="sm"
                                isLoading={deletingUser}
                            >
                                Delete user
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
                        {loading || !user ? (
                            <Skeleton height="4" width="250px" />
                        ) : (
                            user.username
                        )}
                    </DrawerSectionEntry>
                    {loading || !user ? (
                        <DrawerSectionEntry title="Role">
                            <Skeleton height="4" width="250px" />
                        </DrawerSectionEntry>
                    ) : (
                        <RoleInput value={role} onChange={setRole} />
                    )}
                    <DrawerSectionEntry title="Password" alignItems="baseline">
                        {loading || !user ? (
                            <Skeleton height="4" width="250px" />
                        ) : (
                            <Button
                                size="sm"
                                colorScheme="primary"
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
                    <Tooltip
                        label="You cannot update the last admin"
                        fontSize="xs"
                        isDisabled={!isLastAdmin}
                        hasArrow
                        placement="bottom"
                        shouldWrapChildren
                    >
                        <Button
                            size="sm"
                            colorScheme="primary"
                            onClick={onUpdate}
                            disabled={role === user?.role || isLastAdmin}
                        >
                            Update
                        </Button>
                    </Tooltip>
                </HStack>
            </DrawerFooter>
        </DrawerContent>
    );
};

export default UpdateUserForm;
