import React from 'react';
import styled from '@emotion/styled';
import { RiCloseLine } from 'react-icons/ri';

const Button = styled.button`
    width: 40px;
    height: 40px;
    background: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;

    &:not(:disabled):hover {
        opacity: 0.6;
    }

    & > svg {
        width: 20px;
        height: 20px;
    }
`;

const CloseButton = (
    props: React.ComponentPropsWithRef<'button'>
): JSX.Element => (
    <Button {...props}>
        <RiCloseLine />
    </Button>
);

export default CloseButton;
