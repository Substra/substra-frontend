import { useState } from 'react';

import { AxiosError } from 'axios';
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
    List,
    FormErrorMessage,
} from '@chakra-ui/react';
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri';

import useAppSelector from '@/hooks/useAppSelector';
import useKeyFromPath from '@/hooks/useKeyFromPath';
import { getUrlSearchParams } from '@/hooks/useLocationWithParams';
import * as UsersApi from '@/modules/users/UsersApi';
import {
    checkPasswordErrors,
    hasCorrectLenght,
    hasLowerAndUpperChar,
    hasNumber,
    hasSpecialChar,
    isDifferentFromUsername,
} from '@/modules/users/UsersUtils';
import { PATHS } from '@/paths';
import NotFound from '@/routes/notfound/NotFound';

import PasswordValidationMessage from '@/components/PasswordValidationMessage';

const ResetForm = (): JSX.Element => {
    const [, setLocation] = useLocation();
    const [password, setPassword] = useState('');
    const [passwordHasErrors, setPasswordHasErrors] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordIdentical, setConfirmPasswordIdentical] =
        useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [confirmIsDirty, setConfirmIsDirty] = useState(false);

    const username = useKeyFromPath(PATHS.RESET_PASSWORD);
    const urlSearchParams = getUrlSearchParams();
    const resetToken = urlSearchParams.get('token');

    const userLoading = useAppSelector((state) => state.users.userLoading);

    const isEmpty = !password.length;

    const submitReset = async (password: string) => {
        if (
            username &&
            resetToken &&
            !passwordHasErrors &&
            confirmPasswordIdentical
        ) {
            const payload = {
                token: resetToken,
                password,
            };

            await UsersApi.resetPassword(username, payload)
                .then(() => setLocation(PATHS.LOGIN))
                .catch((error) => {
                    if (error instanceof AxiosError) {
                        console.error(error);
                    }
                });
        }
    };

    if (!username) {
        return <NotFound />;
    }

    return (
        <Box width="300px" marginX="auto">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    submitReset(password);
                }}
            >
                <Text fontWeight="semibold" fontSize="3xl" marginBottom="4">
                    Reset Password
                </Text>
                <FormControl
                    id="password"
                    isInvalid={passwordHasErrors && isDirty}
                >
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
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password"
                        boxShadow="none !important"
                        value={password}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            setIsDirty(true);
                            setPassword(newValue);
                            setPasswordHasErrors(
                                checkPasswordErrors(newValue, username)
                            );
                        }}
                    />
                </FormControl>
                <List marginTop="2.5" spacing="1.5" fontSize="sm">
                    <PasswordValidationMessage
                        isEmpty={isEmpty}
                        isValid={isDifferentFromUsername(password, username)}
                        message="Password must be different from username"
                    />
                    <PasswordValidationMessage
                        isEmpty={isEmpty}
                        isValid={hasCorrectLenght(password)}
                        message="Length must be between 20 and 64 characters"
                    />
                    <PasswordValidationMessage
                        isEmpty={isEmpty}
                        isValid={hasSpecialChar(password)}
                        message="At least 1 special character"
                    />
                    <PasswordValidationMessage
                        isEmpty={isEmpty}
                        isValid={hasNumber(password)}
                        message="At least 1 number"
                    />
                    <PasswordValidationMessage
                        isEmpty={isEmpty}
                        isValid={hasLowerAndUpperChar(password)}
                        message="At least 1 uppercase and lowercase characters"
                    />
                </List>
                <FormControl
                    id="confirmPassword"
                    marginY="4"
                    isInvalid={!confirmPasswordIdentical && confirmIsDirty}
                >
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmIsDirty(true);
                            setConfirmPassword(e.target.value);
                            setConfirmPasswordIdentical(
                                password === e.target.value
                            );
                        }}
                        disabled={userLoading}
                        isRequired
                    />
                    <FormErrorMessage>
                        Passwords are not identical
                    </FormErrorMessage>
                </FormControl>

                <Button
                    disabled={userLoading}
                    isLoading={userLoading}
                    type="submit"
                    colorScheme="teal"
                    width="100%"
                >
                    Reset
                </Button>
            </form>
        </Box>
    );
};

export default ResetForm;
