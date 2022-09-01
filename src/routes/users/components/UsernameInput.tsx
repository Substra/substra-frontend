import { useState } from 'react';

import { FormControl, Input, FormErrorMessage } from '@chakra-ui/react';

import { DrawerSectionEntry } from '@/components/DrawerSection';

type UsernameInputProps = {
    value: string;
    onChange: (value: string) => void;
    hasErrors: boolean;
    setHasErrors: (hasErrors: boolean) => void;
};

const UsernameInput = ({
    value,
    onChange,
    hasErrors,
    setHasErrors,
}: UsernameInputProps): JSX.Element => {
    const [isDirty, setIsDirty] = useState(false);

    return (
        <DrawerSectionEntry title="Username">
            <FormControl isInvalid={hasErrors && isDirty}>
                <Input
                    size="sm"
                    id="username"
                    type="text"
                    placeholder="John Doe"
                    boxShadow="none !important"
                    value={value}
                    onChange={(e) => {
                        onChange(e.target.value);
                        setIsDirty(true);
                        setHasErrors(e.target.value === '');
                    }}
                />
                {hasErrors && isDirty && (
                    <FormErrorMessage>
                        You must enter a username
                    </FormErrorMessage>
                )}
            </FormControl>
        </DrawerSectionEntry>
    );
};

export default UsernameInput;
