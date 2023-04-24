import { useEffect } from 'react';

import { useLocation } from 'wouter';

import {
    Box,
    Flex,
    HStack,
    Text,
    VStack,
    Link,
    Button,
} from '@chakra-ui/react';

import LoginBackground from '@/assets/login-background.png';
import SubstraLogo from '@/assets/svg/substra-full-name-logo.svg';
import useAuthStore from '@/features/auth/useAuthStore';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import { PATHS } from '@/paths';

import LoginForm from './components/LoginForm';

const Login = (): JSX.Element => {
    const [, setLocation] = useLocation();

    const { authenticated, fetchLogout } = useAuthStore();

    const urlSearchParams = new URLSearchParams(window.location.search);
    const nextLocation = urlSearchParams.get('next') || PATHS.COMPUTE_PLANS;
    const forceLogout = !!urlSearchParams.get('logout');

    useDocumentTitleEffect((setDocumentTitle) => setDocumentTitle('Login'), []);

    useEffect(() => {
        if (forceLogout && authenticated) {
            const logOut = async () => {
                await fetchLogout();
                setLocation(encodeURI(`${PATHS.LOGIN}?next=${nextLocation}`));
            };
            logOut();
        }
        if (!forceLogout && authenticated) {
            setLocation(nextLocation);
        }
    }, [forceLogout, authenticated, fetchLogout, setLocation, nextLocation]);

    return (
        <HStack
            backgroundColor="#F7FAFC"
            flex="1"
            spacing="0"
            alignItems="stretch"
        >
            <VStack
                height="100vh"
                width="500px"
                backgroundColor="white"
                alignItems="flex-start"
                justifyContent="space-between"
                padding="8"
                spacing="8"
            >
                <Box>
                    <SubstraLogo />
                </Box>
                <Box alignItems="center" width="100%">
                    <LoginForm />
                </Box>
                <Text color="gray.500" fontSize="xs">
                    {`Frontend v.  ${__APP_VERSION__}`}
                </Text>
            </VStack>
            <Flex
                flexDirection="column"
                flexGrow="1"
                alignItems="flex-start"
                padding="10%"
                backgroundImage={LoginBackground}
                justifyContent="center"
                style={{
                    backgroundPosition: 'center center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                }}
            >
                <Text marginY="4" fontSize="2xl" color="white">
                    Unlock AI, break data silos, and protect privacy with our
                    Federated Learning software
                </Text>
                <Button
                    as={Link}
                    variant="outline"
                    colorScheme="whiteAlpha"
                    color="white"
                    href="https://docs.substra.org/"
                    _hover={{
                        textDecoration: 'none',
                    }}
                    isExternal
                >
                    Learn more!
                </Button>
            </Flex>
        </HStack>
    );
};

export default Login;
