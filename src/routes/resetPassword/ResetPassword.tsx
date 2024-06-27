import { useState } from 'react';

import { useLocation, useParams } from 'wouter';

import {
    Box,
    HStack,
    Text,
    VStack,
    Link,
    Button,
    Flex,
} from '@chakra-ui/react';

import * as UsersApi from '@/api/UsersApi';
import LoginBackground from '@/assets/login-background.png';
import SubstraLogoBlack from '@/assets/svg/substra-full-name-logo.svg';
import { useDocumentTitleEffect } from '@/hooks/useDocumentTitleEffect';
import useEffectOnce from '@/hooks/useEffectOnce';
import { getUrlSearchParams } from '@/hooks/useLocationWithParams';
import { PATHS } from '@/paths';

import NotFound from '../notfound/NotFound';
import ResetForm from './components/ResetForm';

const ResetPassword = (): JSX.Element => {
    const [, setLocation] = useLocation();
    const { key } = useParams();

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
                        <SubstraLogoBlack />
                    </Link>
                </Box>
                <Box alignItems="center" width="100%">
                    <ResetForm />
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
                    href="https://github.com/Substra/substra-frontend/"
                    isExternal
                    color="white"
                >
                    <Button variant="outline" colorScheme="whiteAlpha">
                        <Text color="white">Learn more on Github!</Text>
                    </Button>
                </Link>
            </Flex>
        </HStack>
    );
};

export default ResetPassword;
