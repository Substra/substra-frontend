import { useRef } from 'react';

import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    HStack,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spacer,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { RiArrowDownSLine } from 'react-icons/ri';

import { useToast } from '@/hooks/useToast';
import { AbortFunctionT } from '@/types/CommonTypes';
import { UserRolesT, UserT } from '@/types/UsersTypes';

import useUsersStore from '../useUsersStore';

const UserAwaitingApproval = ({
    user,
    fetchUsersList,
    setIsRequestAccepted,
}: {
    user: UserT;
    fetchUsersList: () => AbortFunctionT;
    setIsRequestAccepted: (bool: boolean) => void;
}): JSX.Element | null => {
    const toast = useToast();
    const isAccepted = user.role !== undefined;
    const {
        isOpen: isConfirmOpen,
        onOpen: onConfirmOpen,
        onClose: onConfirmClose,
    } = useDisclosure();
    const cancelRef = useRef<HTMLButtonElement>(null);

    const {
        approvingUserAwaitingApproval,
        deletingUserAwaitingApproval,
        fetchUsersAwaitingApproval,
        deleteUserAwaitingApproval,
        approveUserAwaitingApproval,
    } = useUsersStore();

    const onDelete = async () => {
        const error = await deleteUserAwaitingApproval(user.username);
        if (error === null) {
            toast({
                title: `${user.username} deleted`,
                status: 'success',
                isClosable: true,
            });
            fetchUsersAwaitingApproval();
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

    const onApprove = async (role: UserRolesT) => {
        const error = await approveUserAwaitingApproval(user.username, {
            role,
        });
        if (error === null) {
            setIsRequestAccepted(true);
            fetchUsersList();
        } else {
            toast({
                title: 'User approval failed',
                descriptionComponent:
                    typeof error === 'string' ? error : "Couldn't approve user",
                status: 'error',
                isClosable: true,
            });
        }
    };

    return (
        <Box bg="white" width="100%" padding={2.5}>
            {isAccepted ? (
                <HStack
                    display="flex"
                    justifyContent="space-between"
                    marginLeft="3"
                >
                    <Text fontSize="sm">{user.username}</Text>
                    <Text fontSize="sm">{user.email}</Text>
                    <Spacer />
                    <Button size="sm" isDisabled>
                        Accepted
                    </Button>
                </HStack>
            ) : (
                <HStack
                    display="flex"
                    justifyContent="space-between"
                    marginLeft="3"
                >
                    <Text fontSize="sm">{user.username}</Text>
                    <Text fontSize="sm">{user.email}</Text>
                    <Spacer />
                    <Button size="sm" colorScheme="red" onClick={onConfirmOpen}>
                        Reject
                    </Button>
                    <AlertDialog
                        isOpen={isConfirmOpen}
                        leastDestructiveRef={cancelRef}
                        onClose={onConfirmClose}
                        size="md"
                        isCentered
                    >
                        <AlertDialogOverlay>
                            <AlertDialogContent fontSize="sm">
                                <AlertDialogHeader
                                    fontSize="lg"
                                    fontWeight="bold"
                                >
                                    Are you sure you want to delete this
                                    request?
                                </AlertDialogHeader>
                                <AlertDialogBody>
                                    You are about to delete this access request.
                                    Keep in mind that this request might be
                                    directed to another admin of your
                                    organization.
                                </AlertDialogBody>
                                <AlertDialogFooter>
                                    <Button onClick={onConfirmClose} size="sm">
                                        Cancel
                                    </Button>
                                    <Button
                                        colorScheme="red"
                                        onClick={onDelete}
                                        ml="3"
                                        size="sm"
                                        isDisabled={
                                            deletingUserAwaitingApproval
                                        }
                                    >
                                        Delete request
                                    </Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialogOverlay>
                    </AlertDialog>
                    <Box>
                        <Menu>
                            <MenuButton
                                as={Button}
                                rightIcon={<Icon as={RiArrowDownSLine} />}
                                variant="outline"
                                colorScheme="primary"
                                size="sm"
                                bg="#5752ff"
                                color="white"
                                borderWidth={0}
                                borderRadius={0}
                                _hover={{ bg: '#4525ee' }}
                                isDisabled={approvingUserAwaitingApproval}
                            >
                                Accept as...
                            </MenuButton>
                            <MenuList zIndex="popover" paddingY={0}>
                                <MenuItem
                                    onClick={() => onApprove(UserRolesT.user)}
                                    fontSize="xs"
                                >
                                    User
                                </MenuItem>
                                <MenuItem
                                    onClick={() => onApprove(UserRolesT.admin)}
                                    fontSize="xs"
                                >
                                    Admin
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Box>
                </HStack>
            )}
        </Box>
    );
};

export default UserAwaitingApproval;
