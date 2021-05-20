import React from 'react';
import styled from '@emotion/styled';

import { Colors, Spaces } from '@/assets/theme';

type ButtonProps = {
    children: React.ReactNode;
    disabled?: boolean;
    fullWidth?: boolean;
    onClick(event: React.MouseEvent<HTMLButtonElement>): void;
};

const defaultProps = {
    disabled: false,
    fullWidth: false,
};

const Button = styled.button<ButtonProps>`
    display: inline-block;
    cursor: pointer;
    border: none;
    border-radius: 4px;
    text-align: center;
    text-transform: uppercase;
    padding: ${Spaces.medium};
    color: white;
    background-color: ${Colors.primary};
    width: ${(props) => (props.fullWidth ? '100%' : '')};
    opacity: ${(props) => (props.disabled ? 0.7 : 1)};
    &:focus {
        text-decoration: none;
        box-shadow: 0 0 0 2px rgba(91, 111, 179, 0.2),
            0 0 0 1px ${Colors.primaryBoxShadow};
    }
    &:active {
        background-color: ${Colors.primaryPressed};
    }
    &:hover {
        background-color: ${(props) =>
            props.disabled ? Colors.primary : Colors.primaryHover};
    }
`;

Button.defaultProps = defaultProps;

export default Button;
