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
import SubstraLogoBlack from '@/assets/svg/substra-full-name-logo.svg';
import useAppDispatch from '@/hooks/useAppDispatch';
import useAppSelector from '@/hooks/useAppSelector';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import { logOut } from '@/modules/me/MeSlice';
import { PATHS } from '@/paths';

import LoginForm from './components/LoginForm';

const Login = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [, setLocation] = useLocation();

    const authenticated = useAppSelector((state) => state.me.authenticated);

    const urlSearchParams = new URLSearchParams(window.location.search);
    const nextLocation = urlSearchParams.get('next') || PATHS.COMPUTE_PLANS;
    const forceLogout = !!urlSearchParams.get('logout');

    useDocumentTitleEffect((setDocumentTitle) => setDocumentTitle('Login'), []);

    useEffect(() => {
        if (forceLogout && authenticated) {
            dispatch(logOut()).then(() =>
                setLocation(encodeURI(`${PATHS.LOGIN}?next=${nextLocation}`))
            );
        }
        if (!forceLogout && authenticated) {
            setLocation(nextLocation);
        }
    }, [forceLogout, authenticated, dispatch, setLocation, nextLocation]);

    return (
        <HStack backgroundColor="#F7FAFC" flex="1" spacing="0">
            <VStack
                height="100vh"
                width="500px"
                backgroundColor="white"
                alignItems="flex-start"
                justifyContent="space-between"
            >
                <Box padding="8">
                    <SubstraLogoBlack />
                </Box>
                <Box alignItems="center" width="100%">
                    <LoginForm />
                </Box>
                <Text color="gray.500" fontSize="xs" paddingX="5" paddingY="8">
                    Frontend vers.
                    {__APP_VERSION__}
                </Text>
            </VStack>
            <Flex
                flexDirection="column"
                height="100vh"
                padding="10%"
                backgroundImage={LoginBackground}
                justifyContent="center"
                style={{
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                }}
            >
                <Text marginY="4" fontSize="2xl" color="white">
                    Unlock AI, break data silos, and protect privacy with our
                    Federated Learning software
                </Text>
                <Link
                    href="https://owkin.com/owkin-connect/"
                    isExternal
                    color="white"
                >
                    <Button variant="outline" colorScheme="whiteAlpha">
                        <Text color="white">Tell me more!</Text>
                    </Button>
                </Link>
            </Flex>
        </HStack>
    );
};

export default Login;
