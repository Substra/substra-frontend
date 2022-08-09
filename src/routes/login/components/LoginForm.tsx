import { useState } from 'react';

import { unwrapResult } from '@reduxjs/toolkit';
import { useLocation } from 'wouter';

import {
    Button,
    Box,
    FormControl,
    FormLabel,
    Input,
    Text,
    HStack,
    Icon,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
} from '@chakra-ui/react';
import { RiErrorWarningLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { LoginPayloadT } from '@/modules/me/MeApi';
import { logIn, retrieveInfo } from '@/modules/me/MeSlice';
import { listOrganizations } from '@/modules/organizations/OrganizationsSlice';
import { PATHS } from '@/paths';

const LoginForm = (): JSX.Element => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const [, setLocation] = useLocation();

    const organizationId = useAppSelector(
        (state) => state.me.info.organization_id
    );
    const userLoading = useAppSelector((state) => state.me.loading);
    const userError = useAppSelector((state) => state.me.error);

    const submitLogin = async (username: string, password: string) => {
        const payload: LoginPayloadT = {
            username,
            password,
        };
        const urlSearchParams = new URLSearchParams(window.location.search);

        const nextLocation = urlSearchParams.get('next') || PATHS.COMPUTE_PLANS;

        dispatch(logIn(payload))
            .then(unwrapResult)
            .then(
                () => {
                    // Fetch current organization name to update the page's header
                    dispatch(listOrganizations());
                    dispatch(retrieveInfo(true));
                    setLocation(nextLocation);
                },
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                () => {
                    // do nothing if login failed
                }
            );
    };

    return (
        <Box width="300px" marginX="auto">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    submitLogin(username, password);
                }}
            >
                <Text fontWeight="semibold" fontSize="3xl" marginBottom="4">
                    Login to {organizationId}
                </Text>
                {userError && (
                    <Alert
                        marginY="4"
                        status="error"
                        justifyContent="flex-start"
                        alignItems="flex-start"
                    >
                        <AlertIcon as={RiErrorWarningLine} color="red.900" />
                        <Box flex="1">
                            <AlertTitle color="red.900">
                                Wrong username / password
                            </AlertTitle>
                            <AlertDescription color="red.900">
                                {userError}
                            </AlertDescription>
                        </Box>
                    </Alert>
                )}
                <FormControl id="username">
                    <FormLabel>Username</FormLabel>
                    <Input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={userLoading}
                        isRequired
                    />
                </FormControl>
                <FormControl id="password" marginY="4">
                    <HStack
                        justifyContent="space-between"
                        alignItems="flex-start"
                    >
                        <FormLabel>Password</FormLabel>
                        <Button
                            leftIcon={
                                <Icon
                                    as={showPassword ? RiEyeOffLine : RiEyeLine}
                                />
                            }
                            colorScheme="teal"
                            variant="link"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </Button>
                    </HStack>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={userLoading}
                        isRequired
                    />
                </FormControl>

                <Button
                    disabled={userLoading}
                    isLoading={userLoading}
                    type="submit"
                    colorScheme="teal"
                    width="100%"
                >
                    Login
                </Button>
            </form>
        </Box>
    );
};

export default LoginForm;
