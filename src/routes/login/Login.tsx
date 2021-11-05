import { useEffect } from 'react';

import LoginForm from './components/LoginForm';
import {
    AspectRatio,
    Box,
    HStack,
    Text,
    VStack,
    Link,
    Button,
} from '@chakra-ui/react';
import ReactPlayer from 'react-player';
import { useLocation } from 'wouter';

import { logOut } from '@/modules/user/UserSlice';

import { useAppDispatch, useAppSelector } from '@/hooks';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';

import { PATHS } from '@/routes';

import OwkinLogoBlack from '@/assets/svg/owkin-logo-black';

declare const __APP_VERSION__: string;

const Login = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const [, setLocation] = useLocation();

    const authenticated = useAppSelector((state) => state.user.authenticated);

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
    });

    return (
        <HStack backgroundColor="#F7FAFC" flex="1">
            <VStack
                height="100vh"
                width="500px"
                backgroundColor="white"
                alignItems="flex-start"
                justifyContent="space-between"
                paddingX="6"
                paddingY="8"
            >
                <OwkinLogoBlack />
                <Box alignItems="center" width="100%">
                    <LoginForm />
                </Box>
                <Text color="gray.500" fontSize="xs">
                    © Owkin - All rights reserved. Frontend vers.
                    {__APP_VERSION__}
                </Text>
            </VStack>
            <Box padding="12" flex="auto">
                <AspectRatio ratio={16 / 9}>
                    <ReactPlayer
                        url="https://vimeo.com/541687596"
                        controls
                        width="100%"
                        height="100%"
                        config={{
                            vimeo: {
                                playerOptions: {
                                    byline: true,
                                    portrait: true,
                                    title: true,
                                },
                            },
                        }}
                    />
                </AspectRatio>
                <Text marginY="4" fontSize="2xl">
                    Unlock AI, break data silos, and protect privacy with our
                    Federated Learning software
                </Text>
                <Link href="https://owkin.com/owkin-connect/" isExternal>
                    <Button variant="outline" colorScheme="black">
                        <Text>Tell me more!</Text>
                    </Button>
                </Link>
            </Box>
        </HStack>
    );
};

export default Login;
