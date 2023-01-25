import { useState } from 'react';

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
    Link,
    Divider,
} from '@chakra-ui/react';
import { RiErrorWarningLine, RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

import { LoginPayloadT } from '@/api/MeApi';
import useAuthStore from '@/features/auth/useAuthStore';
import useOrganizationsStore from '@/features/organizations/useOrganizationsStore';
import { PATHS } from '@/paths';

const LoginForm = (): JSX.Element => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [, setLocation] = useLocation();

    const {
        info: { organization_id: organizationId, auth: authInfo },
        postingLogin,
        loginError,
        postLogin,
        fetchInfo,
    } = useAuthStore();

    const { fetchOrganizations } = useOrganizationsStore();

    const urlSearchParams = new URLSearchParams(window.location.search);
    const nextLocation = urlSearchParams.get('next') || PATHS.COMPUTE_PLANS;

    const submitLogin = async (username: string, password: string) => {
        const payload: LoginPayloadT = {
            username,
            password,
        };

        const fetchAll = async () => {
            const logIn = await postLogin(payload);
            if (logIn !== null) {
                // Fetch current organization name to update the page's header
                fetchOrganizations();
                fetchInfo(true);
                setLocation(nextLocation);
            }
        };
        fetchAll();
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

                {authInfo?.oidc && (
                    <Box>
                        <Button
                            width="100%"
                            marginBottom="4"
                            as={Link}
                            href={`${API_URL}${
                                authInfo.oidc.login_url
                            }?next=${encodeURIComponent(
                                window.location.origin + nextLocation
                            )}`}
                        >
                            Sign in with {authInfo.oidc.name}
                        </Button>
                        <Divider marginBottom="4" />
                    </Box>
                )}

                {loginError && (
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
                                {loginError}
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
                        disabled={postingLogin}
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
                            colorScheme="primary"
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
                        disabled={postingLogin}
                        isRequired
                    />
                </FormControl>

                <Button
                    disabled={postingLogin}
                    isLoading={postingLogin}
                    type="submit"
                    colorScheme="primary"
                    width="100%"
                >
                    Login
                </Button>
            </form>
        </Box>
    );
};

export default LoginForm;
