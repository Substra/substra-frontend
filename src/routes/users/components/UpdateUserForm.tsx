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

import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
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
    username,
}: {
    closeHandler: () => void;
    username: string;
}): JSX.Element => {
    const dispatch = useAppDispatch();
    const toast = useToast();

    const {
        isOpen: isConfirmOpen,
        onOpen: onConfirmOpen,
        onClose: onConfirmClose,
    } = useDisclosure();

    const [resetUrl, setResetUrl] = useState('');
    const { onCopy } = useClipboard(resetUrl);
    const cancelRef = useRef<HTMLButtonElement>(null);

    const user = useAppSelector((state) => state.users.user);
    const deleting = useAppSelector((state) => state.users.deleting);

    const [role, setRole] = useState(UserRolesT.user);
    const [isLastAdmin, setIsLastAdmin] = useState<boolean>(false);

    // Custom loading state that handles both loading the user and checking
    // whether they are the last admin.
    const [loading, setLoading] = useState(true);

    const onUpdate = () => {
        if (user && role !== user.role) {
            dispatch(updateUser({ key: user.username, payload: { role } }))
                .unwrap()
                .then(() => {
                    toast({
                        title: `User updated`,
                        descriptionComponent: () => (
                            <Text>
                                {user.username} was successfully updated!
                            </Text>
                        ),
                        status: 'success',
                        isClosable: true,
                    });

                    closeHandler();
                });
        }
    };

    const onDelete = () => {
        dispatch(deleteUser(username))
            .unwrap()
            .then(() => {
                toast({
                    title: `User deleted`,
                    descriptionComponent: () => (
                        <Text>{username} was successfully deleted</Text>
                    ),
                    status: 'success',
                    isClosable: true,
                });

                closeHandler();
            });
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
        const promise = dispatch(retrieveUser(username));

        promise
            .unwrap()
            .then(async (user) => {
                // check if current user is the last admin
                if (user.role === UserRolesT.admin) {
                    const response = await UsersApi.listUsers(
                        { pageSize: 1, role: UserRolesT.admin },
                        {}
                    );
                    const adminsCount = response.data['count'];
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
            })
            .catch((error) => {
                // We want to catch all abort errors as they are expected
                // since we want to cancel all unnecessary calls.
                // Other errors should be re-thrown.
                if (error.name !== 'AbortError') {
                    throw error;
                }
            });

        return () => {
            promise.abort();
        };
    }, [dispatch, username]);

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
