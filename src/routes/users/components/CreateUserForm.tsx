import { useState } from 'react';

import {
    Button,
    DrawerBody,
    VStack,
    DrawerFooter,
    HStack,
    DrawerContent,
} from '@chakra-ui/react';

import useAppDispatch from '@/hooks/useAppDispatch';
import { useToast } from '@/hooks/useToast';
import { createUser } from '@/modules/users/UsersSlice';
import { UserRolesT } from '@/modules/users/UsersTypes';

import DrawerHeader from '@/components/DrawerHeader';

import PasswordInput from './PasswordInput';
import RoleInput from './RoleInput';
import UsernameInput from './UsernameInput';

const CreateUserForm = ({
    closeHandler,
}: {
    closeHandler: () => void;
}): JSX.Element => {
    const dispatch = useAppDispatch();
    const toast = useToast();

    const [username, setUsername] = useState('');
    const [usernameHasError, setUsernameHasError] = useState(username === '');

    const [role, setRole] = useState(UserRolesT.user);

    const [password, setPassword] = useState('');
    const [passwordHasErrors, setPasswordHasErrors] = useState(false);

    const onSave = async () => {
        if (!usernameHasError && !passwordHasErrors) {
            await dispatch(
                createUser({
                    username: username,
                    password: password,
                    role: role,
                })
            );

            toast({
                title: 'User created',
                descriptionComponent: `${username} was successfully created!`,
                status: 'success',
                isClosable: true,
            });
            closeHandler();
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
                    />
                    <RoleInput value={role} onChange={setRole} />
                    <PasswordInput
                        value={password}
                        username={username}
                        onChange={setPassword}
                        hasErrors={passwordHasErrors}
                        setHasErrors={setPasswordHasErrors}
                    />
                </VStack>
            </DrawerBody>
            <DrawerFooter>
                <HStack spacing="2">
                    <Button size="sm" variant="outline" onClick={closeHandler}>
                        Cancel
                    </Button>
                    <Button size="sm" colorScheme="primary" onClick={onSave}>
                        Save
                    </Button>
                </HStack>
            </DrawerFooter>
        </DrawerContent>
    );
};

export default CreateUserForm;
