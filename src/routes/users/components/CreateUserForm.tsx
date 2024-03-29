import { useState } from 'react';

import {
    Button,
    DrawerBody,
    VStack,
    DrawerFooter,
    HStack,
    DrawerContent,
} from '@chakra-ui/react';

import { useToast } from '@/hooks/useToast';
import { AbortFunctionT } from '@/types/CommonTypes';
import { UserRolesT } from '@/types/UsersTypes';

import DrawerHeader from '@/components/DrawerHeader';

import useUsersStore from '../useUsersStore';
import PasswordInput from './PasswordInput';
import RoleInput from './RoleInput';
import UsernameInput from './UsernameInput';

const CreateUserForm = ({
    closeHandler,
    fetchUsersList,
}: {
    closeHandler: () => void;
    fetchUsersList: () => AbortFunctionT;
}): JSX.Element => {
    const toast = useToast();

    const [username, setUsername] = useState('');
    const [usernameHasError, setUsernameHasError] = useState(username === '');

    const [role, setRole] = useState(UserRolesT.user);

    const [password, setPassword] = useState('');
    const [passwordHasErrors, setPasswordHasErrors] = useState(false);

    const { creatingUser, createUser } = useUsersStore();

    const onSave = async () => {
        if (!usernameHasError && !passwordHasErrors) {
            const error = await createUser({
                username,
                password,
                role,
            });

            if (error === null) {
                toast({
                    title: 'User created',
                    descriptionComponent: `${username} was successfully created!`,
                    status: 'success',
                    isClosable: true,
                });
                fetchUsersList();
                closeHandler();
            } else {
                toast({
                    title: 'User creation failed',
                    descriptionComponent:
                        typeof error === 'string'
                            ? error
                            : "Couldn't create user",
                    status: 'error',
                    isClosable: true,
                });
            }
        }
    };

    return (
        <DrawerContent data-cy="drawer">
            <DrawerHeader
                title="Create user"
                onClose={closeHandler}
                loading={false}
            />
            <DrawerBody
                as={VStack}
                alignItems="stretch"
                spacing="8"
                paddingX="5"
                paddingY="8"
            >
                <VStack spacing={1} alignItems="flex-start">
                    <UsernameInput
                        value={username}
                        onChange={setUsername}
                        hasErrors={usernameHasError}
                        setHasErrors={setUsernameHasError}
                        isDisabled={creatingUser}
                    />
                    <RoleInput
                        value={role}
                        onChange={setRole}
                        isDisabled={creatingUser}
                    />
                    <PasswordInput
                        value={password}
                        username={username}
                        onChange={setPassword}
                        hasErrors={passwordHasErrors}
                        setHasErrors={setPasswordHasErrors}
                        isDisabled={creatingUser}
                    />
                </VStack>
            </DrawerBody>
            <DrawerFooter>
                <HStack spacing="2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={closeHandler}
                        isDisabled={creatingUser}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="sm"
                        colorScheme="primary"
                        onClick={onSave}
                        isDisabled={
                            creatingUser ||
                            usernameHasError ||
                            passwordHasErrors
                        }
                        isLoading={creatingUser}
                        data-cy="submit-form"
                    >
                        Save
                    </Button>
                </HStack>
            </DrawerFooter>
        </DrawerContent>
    );
};

export default CreateUserForm;
