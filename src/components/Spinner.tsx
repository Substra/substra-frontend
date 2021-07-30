/** @jsxRuntime classic */

/** @jsx jsx */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx, keyframes } from '@emotion/react';
import { RiLoader4Line } from 'react-icons/ri';

const rotate = keyframes`
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
`;

const rotation = css`
    animation: ${rotate} 2s linear infinite;
`;

interface SpinnerProps {
    color?: string;
}

const Spinner = ({ color }: SpinnerProps): JSX.Element => (
    <RiLoader4Line css={rotation} color={color} />
);

export default Spinner;
