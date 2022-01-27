import { useState } from 'react';

import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { RiPushpinFill, RiPushpinLine } from 'react-icons/ri';

const StyledInput = styled('input')`
    border: 0px;
    clip: rect(0px, 0px, 0px, 0px);
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0px;
    overflow: hidden;
    white-space: nowrap;
    position: absolute;
`;

interface PinBoxProps {
    isChecked: boolean;
    onChange: () => void;
}
const PinBox = ({ isChecked, onChange }: PinBoxProps): JSX.Element => {
    const [focus, setFocus] = useState(false);
    return (
        <Box
            cursor="pointer"
            boxShadow={focus ? 'outline' : undefined}
            transitionProperty="box-shadow"
            transitionDuration="normal"
        >
            {!isChecked && (
                <RiPushpinLine fill="var(--chakra-colors-gray-300)" />
            )}
            {isChecked && (
                <RiPushpinFill fill="var(--chakra-colors-teal-500)" />
            )}
            <StyledInput
                type="checkbox"
                onChange={onChange}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
            />
        </Box>
    );
};

export default PinBox;
