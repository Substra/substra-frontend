import { useEffect, useState } from 'react';

import {
    FormControl,
    InputGroup,
    Input,
    InputRightElement,
    IconButton,
    List,
} from '@chakra-ui/react';
import { RiEyeLine } from 'react-icons/ri';

import {
    isPasswordValid,
    hasCorrectLength,
    hasLowerAndUpperChar,
    hasNumber,
    hasSpecialChar,
    isDifferentFromUsername,
} from '@/routes/users/UsersUtils';
import PasswordValidationMessage from '@/routes/users/components/PasswordValidationMessage';

import { DrawerSectionEntry } from '@/components/DrawerSection';

type PasswordInputProps = {
    value: string;
    username: string;
    onChange: (value: string) => void;
    hasErrors: boolean;
    setHasErrors: (setHasErrors: boolean) => void;
    isDisabled: boolean;
};

const PasswordInput = ({
    value,
    username,
    onChange,
    hasErrors,
    setHasErrors,
    isDisabled,
}: PasswordInputProps): JSX.Element => {
    const [isDirty, setIsDirty] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isEmpty = !value.length;

    useEffect(() => {
        setHasErrors(!isPasswordValid(value, username));
    }, [value, username, setHasErrors]);

    return (
        <DrawerSectionEntry title="Password" alignItems="baseline">
            <FormControl
                isInvalid={hasErrors && isDirty}
                isDisabled={isDisabled}
            >
                <InputGroup size="sm">
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password"
                        boxShadow="none !important"
                        value={value}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            setIsDirty(true);
                            onChange(newValue);
                        }}
                        data-cy="password-input"
                    />
                    <InputRightElement>
                        <IconButton
                            size="sm"
                            variant="ghost"
                            icon={<RiEyeLine />}
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label="Show password"
                            _focus={{ outline: 'none' }}
                        />
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            <List marginTop="2.5" spacing="1.5">
                <PasswordValidationMessage
                    isEmpty={isEmpty}
                    isValid={isDifferentFromUsername(value, username)}
                    message="Password must be different from username"
                />
                <PasswordValidationMessage
                    isEmpty={isEmpty}
                    isValid={hasCorrectLength(value)}
                    message="Length must be between 20 and 64 characters"
                />
                <PasswordValidationMessage
                    isEmpty={isEmpty}
                    isValid={hasSpecialChar(value)}
                    message="At least 1 special character"
                />
                <PasswordValidationMessage
                    isEmpty={isEmpty}
                    isValid={hasNumber(value)}
                    message="At least 1 number"
                />
                <PasswordValidationMessage
                    isEmpty={isEmpty}
                    isValid={hasLowerAndUpperChar(value)}
                    message="At least 1 uppercase and lowercase characters"
                />
            </List>
        </DrawerSectionEntry>
    );
};

export default PasswordInput;
