/** @jsx jsx */
import React, { useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import { RiCheckLine } from 'react-icons/ri';
import copy from 'copy-to-clipboard';

import { Colors, Spaces } from '@/assets/theme';
import styled from '@emotion/styled';

const Button = styled.button`
    position: relative;
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

const IconContainer = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: white;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.1s ease-out;

    svg {
        height: 20px;
        width: 20px;
    }
`;

const activeStyles = css`
    opacity: 1;
    pointer-events: initial;
`;

interface CopyButtonProps {
    value: string;
    children: React.ReactNode;
}

const CopyButton = ({
    value,
    children,
    ...props
}: CopyButtonProps): JSX.Element => {
    const [copied, setCopied] = useState(false);

    const onClick = () => {
        copy(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button type="button" onClick={onClick} {...props}>
            {children}
            <IconContainer
                css={copied && activeStyles}
                aria-hidden={!copied}
                aria-label="copied!"
            >
                <RiCheckLine />
            </IconContainer>
        </Button>
    );
};

export default CopyButton;
