import React from 'react';

import { Colors, Spaces } from '@/assets/theme';
import styled from '@emotion/styled';

const Button = styled.a`
    position: absolute;
    color: ${Colors.primary};
    padding: ${Spaces.medium} 112px ${Spaces.medium};
    background: none;
    border: 1px solid ${Colors.border};
    border-radius: 20px;
    text-decoration: none;
    bottom: 15px;
    text-align: center;
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    text-transform: uppercase;
    height: 40px;
    transform: translateY(-50%);
    margin: 0;

    &:hover {
        background-color: ${Colors.darkerBackground};
    }

    &:active {
        background-color: white;
    }
`;

interface SiderBottomButtonProps {
    target: string;
    children: React.ReactNode;
}

const SiderBottomButton = ({
    target,
    children,
    ...props
}: SiderBottomButtonProps): JSX.Element => {
    return (
        <Button href={target} type="button" {...props}>
            {children}
        </Button>
    );
};

export default SiderBottomButton;
