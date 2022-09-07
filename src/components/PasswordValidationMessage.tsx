import { ListItem, ListIcon } from '@chakra-ui/react';
import {
    RiCheckboxBlankCircleLine,
    RiCheckLine,
    RiCloseLine,
} from 'react-icons/ri';

const PasswordValidationMessage = ({
    isEmpty,
    isValid,
    message,
}: {
    isEmpty: boolean;
    isValid: boolean;
    message: string;
}): JSX.Element => {
    let color = 'black';
    let icon = RiCheckboxBlankCircleLine;

    if (!isEmpty) {
        color = isValid ? 'primary.500' : 'red.500';
        icon = isValid ? RiCheckLine : RiCloseLine;
    }

    return (
        <ListItem color={color}>
            <ListIcon as={icon} color={color} size="sm" />
            {message}
        </ListItem>
    );
};

export default PasswordValidationMessage;
