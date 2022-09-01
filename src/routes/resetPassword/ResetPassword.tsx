import { useState } from 'react';

import ReactPlayer from 'react-player';
import { useLocation } from 'wouter';

import {
    AspectRatio,
    Box,
    HStack,
    Text,
    VStack,
    Link,
    Button,
} from '@chakra-ui/react';

import OwkinLogoBlack from '@/assets/svg/owkin-logo-black.svg';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useEffectOnce from '@/hooks/useEffectOnce';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import { getUrlSearchParams } from '@/hooks/useLocationWithParams';
import * as UsersApi from '@/modules/users/UsersApi';
import { PATHS } from '@/paths';

import NotFound from '../notfound/NotFound';
import ResetForm from './components/ResetForm';

const ResetPassword = (): JSX.Element => {
    const [, setLocation] = useLocation();
    const key = useKeyFromPath(PATHS.RESET_PASSWORD);

    useDocumentTitleEffect(
        (setDocumentTitle) => setDocumentTitle('Reset Password'),
        []
    );

    const urlSearchParams = getUrlSearchParams();
    const resetToken = urlSearchParams.get('token');
    const [validatedToken, setValidatedToken] = useState<boolean>(false);

    useEffectOnce(() => {
        const checkTokenValidity = async () => {
            let response;
            if (key && resetToken) {
                response = await UsersApi.checkResetTokenValidity(
                    key,
                    resetToken
                );
            }
            return response;
        };

        checkTokenValidity()
            .then(() => setValidatedToken(true))
            .catch(() => setLocation(PATHS.LOGIN));
    });

    if (!validatedToken) {
        return <NotFound />;
    }
    return (
        <HStack backgroundColor="#F7FAFC" flex="1">
            <VStack
                height="100vh"
                width="500px"
                backgroundColor="white"
                alignItems="flex-start"
                justifyContent="space-between"
            >
                <Box padding="8">
                    <Link href="/login" _focus={{ border: 'none' }}>
                        <OwkinLogoBlack />
                    </Link>
                </Box>
                <Box alignItems="center" width="100%">
                    <ResetForm />
                </Box>
                <Text color="gray.500" fontSize="xs" paddingX="5" paddingY="8">
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

export default ResetPassword;
