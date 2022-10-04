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
                    <SubstraLogoBlack />
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
