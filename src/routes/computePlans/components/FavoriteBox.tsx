import { useState } from 'react';

import styled from '@emotion/styled';

import { Box } from '@chakra-ui/react';
import { RiStarFill, RiStarLine } from 'react-icons/ri';

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

interface FavoriteBoxProps {
    isChecked: boolean;
    onChange: () => void;
}
const FavoriteBox = ({
    isChecked,
    onChange,
}: FavoriteBoxProps): JSX.Element => {
    const [focus, setFocus] = useState(false);
    return (
        <Box
            cursor="pointer"
            boxShadow={focus ? 'outline' : undefined}
            transitionProperty="box-shadow"
            transitionDuration="normal"
        >
            {!isChecked && <RiStarLine fill="var(--chakra-colors-gray-300)" />}
            {isChecked && <RiStarFill fill="var(--chakra-colors-teal-500)" />}
            <StyledInput
                type="checkbox"
                onChange={onChange}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
            />
        </Box>
    );
};

export default FavoriteBox;
