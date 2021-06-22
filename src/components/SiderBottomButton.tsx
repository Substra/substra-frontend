/** @jsx jsx */
import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import styled from '@emotion/styled';

import { SiderBottomSection } from '@/components/SiderSection';
import { Colors } from '@/assets/theme';
import { downloadFromApi } from '@/libs/request';

const Button = styled.button`
    color: ${Colors.primary};
    height: 40px;
    min-width: 80%;
    background: none;
    border: 1px solid ${Colors.border};
    border-radius: 20px;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    margin: 0 auto;

    &:hover {
        background-color: ${Colors.darkerBackground};
    }

    &:active {
        background-color: white;
    }
`;

interface SiderBottomButtonProps {
    target: string;
    filename: string;
    children: React.ReactNode;
}

const SiderBottomButton = ({
    target,
    filename,
    children,
}: SiderBottomButtonProps): JSX.Element => {
    return (
        <SiderBottomSection
            css={css`
                text-align: center;
            `}
        >
            <Button
                onClick={() => downloadFromApi(target, filename)}
                type="button"
            >
                {children}
            </Button>
        </SiderBottomSection>
    );
};

export default SiderBottomButton;
