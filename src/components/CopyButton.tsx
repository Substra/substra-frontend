import styled from '@emotion/styled';

import { Colors, Spaces } from '@/assets/theme';

{
    /* TODO: copy value of "value" props to clipboard */
}

const CopyButton = styled.button`
    color: ${Colors.primary};
    padding: ${Spaces.small};
    background: none;
    border: 1px solid transparent;
    border-radius: 4px;

    &:hover {
        border-color: ${Colors.primary};
        background-color: ${Colors.darkerBackground};
    }

    &:active {
        background-color: white;
    }
`;

export default CopyButton;
